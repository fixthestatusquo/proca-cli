import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";
import { getTwitter } from "#src/util/twitter.mjs";

export default class OrgAdd extends Command {
  static args = this.namearg();

  static flags = {
    ...this.flagify({ single: true, name: "organisation", char: "o" }),
    title: Flags.string({
      char: "t",
      description: "title/full name of the org",
      helpValue: "<org full name>",
    }),
  };

  create = async (_org) => {
    const org = { ..._org, config: JSON.stringify(_org.config) };

    const AddOrgDocument = gql`
mutation ($org: OrgInput!) {
  addOrg(input: $org) {
    config
    name
    title
  }
}
    `;
    const result = await mutation(AddOrgDocument, {
      org,
    });
    if (!result.addOrg) {
      console.log(result);
      return result;
    }
    return result?.addOrg;
  };

  async run() {
    const { flags } = await this.parse();

    const org = {
      name: flags.name,
      title: flags.title || flags.name,
      config: {},
    };

    const data = await this.create(org);
    return this.output(data);
  }
}
