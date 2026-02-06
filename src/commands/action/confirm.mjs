import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

export default class Actionconfirm extends Command {
  static description =
    "Should the supporter confirm the action? it can be set either for all the widgets or an organisation or all the widgets of a campaign";

  static flags = {
    ...super.globalFlags,
    org: Flags.string({
      aliases: ["name", "o"],
      description: "organisation collecting the action",
      exactlyOne: ["org", "campaign"],
    }),
    campaign: Flags.string({
      aliases: ["c"],
      description: "campaign collecting the action",
    }),
    confirm: Flags.boolean({
      description: "should the supporters confirm each action",
      default: true,
      allowNo: true,
    }),
    template: Flags.string({
      description: "template for sending the message",
    }),
  };

  async mutate(flags) {
    const DocumentOrg = gql`
    mutation UpdateOrgProcessing(
      $name: String!
      $confirm: Boolean!
      $template: String
    ) {
      updateOrgProcessing(
        name: $name
        supporterConfirmTemplate: $template
        supporterConfirm: $confirm
      ) {
        id
        name
        processing {
          supporterConfirm
          supporterConfirmTemplate
        }
      }
    }
  `;
    const DocumentCampaign = gql`
    mutation UpdateCampaignProcessing(
      $name: String!
      $confirm: Boolean!
      $template: String
    ) {
      updateCampaignProcessing(
        name: $name
        supporterConfirmTemplate: $template
        supporterConfirm: $confirm
      ) {
        id
        name
        campaignProcessing {
          supporterConfirm
          supporterConfirmTemplate
        }
      }
    }
  `;
    const Document = flags.org ? DocumentOrg : DocumentCampaign;

    const result = await mutation(Document, {
      name: flags.org || flags.campaign,
      confirm: flags.confirm,
      template: flags.template,
    });
    return result.updateOrgProcessing || result.updateCommandProcessing;
  }

  simplify = (d) => ({
    id: d.id,
    name: d.name,
    template: d.processing.supporterConfirmTemplate,
    confirm: d.processing.supporterConfirm,
  });
  async run() {
    const { flags } = await this.parse();
    const result = await this.mutate(flags);

    this.output(result);
  }
}
