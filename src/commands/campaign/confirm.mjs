import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

export default class Actionconfirm extends Command {
  static description =
    "Should the supporter confirm the action? for all the widgets of a campaign";

  static args = this.namearg();

  static flags = {
    ...this.flagify({ single: true, name: "campaign", char: "c" }),
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
    console.log("Mutate flags:", JSON.stringify(flags, null, 2));
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

    const result = await mutation(DocumentCampaign, {
      name: flags.name,
      confirm: flags.confirm,
      template: flags.template,
    });
    console.log("Mutation result:", JSON.stringify(result, null, 2));
    // Fix: Return the correct mutation result
    return result.updateCampaignProcessing;
  }

  simplify = (d) => {
    const processing = d.campaignProcessing;
    return {
      id: d.id,
      name: d.name,
      template: processing?.supporterConfirmTemplate,
      confirm: processing?.supporterConfirm,
    };
  };
  async run() {
    const { flags } = await this.parse();
    const result = await this.mutate(flags);

    this.output(result);
  }
}
