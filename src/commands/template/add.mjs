import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
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
      description: "name",
      helpValue: "by default  type@language",
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
