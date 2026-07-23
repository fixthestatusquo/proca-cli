import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class TemplateAdd extends Command {
  //static args = { path: { description: "" } };

  static flags = {
    // flag with no value (-f, --force)
    ...super.globalFlags,
    org: Flags.string({
      char: "o",
      description: "organisation",
      required: true,
    }),
    type: Flags.string({
      options: ["thankyou", "doi", "confirm", "doi_thankyou", "doi_confirm"],
      default: "thankyou",
    }),
    lang: Flags.string({
      char: "l",
      description: "language",
      default: "en",
      helpValue: "<locale>",
    }),
    name: Flags.string({
      char: "n",
      description: "name (can include locale via name@locale syntax)",
      helpValue: "by default  type@language",
    }),
    locale: Flags.string({
      char: "L",
      description: "locale (overrides --lang and name@locale extraction)",
      helpValue: "<locale>",
    }),
    subject: Flags.string({
      char: "s",
      description: "subject",
      helpValue: "'template:' + type",
    }),
  };

  create = async (flag) => {
    const orgName = flag.org;

    const addTemplateDocument = gql`
      mutation (
        $org: String!
        $name: String!
        $lang: String!
        $subject: String!
        $text: String
        $html: String
      ) {
        upsertTemplate(
          orgName: $org
          input: { name: $name, locale: $lang, subject:$subject,text: $text, html: $html }
        ) 
      }
    `;

    // if name contains @, split into name and locale
    if (flag?.name.includes("@")) {
      const parts = flag.name.split("@");
      flag.name = parts[0];
      if (!flag.locale) {
        flag.lang = parts[1];
      }
    }

    // explicit --locale overrides both --lang and @-extracted locale
    if (flag.locale) {
      flag.lang = flag.locale;
    }

    if (!flag.name) {
      flag.name = flag.type; // +'@'+flag.lang;
    }

    if (!flag.subject) {
      flag.subject = `template ${flag.type} in ${flag.lang}`;
    }

    if (!flag.text) {
      flag.text = "This is the email body";
    }
    if (!flag.html) {
      flag.html = "This is the email html body";
    }
    try {
      const r = await mutation(addTemplateDocument, flag);
    } catch (e) {
      const errors = e.graphQLErrors;
      console.log(JSON.stringify(e.graphQLErrors, null, 2));
      if (errors[0].path[1] === "name") {
        this.error(`invalid name (already taken?): ${flag.name}`);
        throw new Error(errors[0].message);
      }
      if (errors[0].extensions?.code === "permission_denied") {
        console.error("permission denied to create", flag.name, flag.org);
        throw new Error(errors[0].message);
      }
      throw new Error(errors[0].message);
    }
  };

  async run() {
    const { args, flags } = await this.parse();

    //		const org = { name: flags.twitter || flags.name, config: {} };

    const data = await this.create(flags);
    return this.output(data);
  }
}
