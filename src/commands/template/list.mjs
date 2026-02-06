import { Flags } from "@oclif/core";
import Org from "#src/commands/org/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

export default class OrgTemplate extends Command {
  static description = "list services set for an organisation";

  static flags = {
    ...super.globalFlags,
    org: Flags.string({
      char: "o",
      description: "organisation having the templates",
      required: true,
    }),
  };

  fetch = async (org) => {
    const GetOrgDocument = gql`
      query GetOrg($name: String!) {
        org (name: $name) {
          id name title
   personalData {
      supporterConfirm
      supporterConfirmTemplate
    }
    processing {
      emailFrom
      emailTemplates
      supporterConfirm
      supporterConfirmTemplate
    }

        }
      }
    `;

    const result = await query(GetOrgDocument, {
      name: org,
    });
    const supporterConfirm = (tplName) => {
      if (
        tplName.split("@")[0] === result.org.processing.supporterConfirmTemplate
      ) {
        return result.org.processing.supporterConfirm ? "enabled" : "disabled";
      }
      return "";
    };
    const tpl = result.org.processing?.emailTemplates?.map((d) => ({
      name: d,
      actionConfirm: supporterConfirm(d),
    }));
    return tpl;
  };

  async run() {
    const { flags } = await this.parse();
    const tpl = await this.fetch(flags.org);
    this.output(tpl);
  }
}
