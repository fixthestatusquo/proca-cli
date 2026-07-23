import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class WidgetAdd extends Command {
  static flags = {
    ...super.globalFlags,
    name: Flags.string({
      char: "n",
      required: true,
      description:
        "name of the template (can include locale via name@locale syntax)",
      helpValue: "<template name[@locale]>",
    }),
    locale: Flags.string({
      char: "L",
      description: "locale (extracted from name@locale syntax if not set)",
      helpValue: "<locale>",
    }),
    org: Flags.string({
      char: "o",
      required: true,
      description: "name of the organisation",
      helpValue: "<organisation name>",
    }),
    externalId: Flags.string({
      char: "i",
      required: true,
      description: "external id from the mailer provider",
    }),
  };

  update = async (flag) => {
    // if name contains @, split into name and locale
    if (flag.name.includes("@")) {
      const parts = flag.name.split("@");
      flag.name = parts[0];
      if (!flag.locale) {
        flag.locale = parts[1];
      }
    }

    const Document = gql`mutation ($templateName: String!, $orgName: String!, $id: String!, $locale: String!) {
      upsertTemplate(input: { name: $templateName, externalId: $id, locale: $locale }, orgName: $orgName)
    }`;

    try {
      const r = await mutation(Document, {
        templateName: flag.name,
        locale: flag.locale,
        orgName: flag.org,
        id: flag.externalId,
      });
      return { id: r.upsertTemplate };
    } catch (e) {
      const err = e.graphQLErrors?.[0];
      console.log(err.path);
      if (err?.path?.[1] === "name") {
        this.error(`invalid name (already taken?): ${input.name}`);
      }

      if (err?.extensions?.code === "permission_denied") {
        this.error(`permission denied to create widget for org ${flag.org}`);
      }

      throw new Error(err?.message ?? "failed to create widget");
    }
  };

  async run() {
    const { flags } = await this.parse();
    const data = await this.update(flags);
    return this.output(data);
  }
}
