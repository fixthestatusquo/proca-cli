import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class OrgUpdate extends Command {
  static args = this.namearg();

  static flags = {
    ...this.flagify({ single: true, name: "organisation", char: "o" }),
    title: Flags.string({
      char: "t",
      description: "title/full name of the org",
      helpValue: "<org full name>",
      required: true,
    }),
  };

  update = async (name, org) => {
    const Document = gql`
mutation ($name: String!,$org: OrgInput!) {
  updateOrg(name: $name,input: $org) {
    id
    name
    title
    config
  }
}
    `;
    const result = await mutation(Document, { name, org });
    if (!result.updateOrg) {
      console.log(result);
      return result;
    }
    return result.updateOrg;
  };

  async run() {
    const { flags } = await this.parse();

    const org = {
      title: flags.title,
    };

    const data = await this.update(flags.name, org);
    return this.output(data);
  }
}
