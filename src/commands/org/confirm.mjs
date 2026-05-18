import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

export default class Actionconfirm extends Command {
  static description =
    "Should the supporter confirm the action? Set for all the widgets of an organisation";

  static args = this.namearg();

  static flags = {
    ...this.flagify({ single: true, name: "organisation", char: "o" }),
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

    const result = await mutation(DocumentOrg, {
      name: flags.name,
      confirm: flags.confirm,
      template: flags.template,
    });
    console.log("Mutation result:", JSON.stringify(result, null, 2));
    // Fix: Return the correct mutation result
    return result.updateOrgProcessing;
  }

  simplify = (d) => {
    const processing = d.processing;
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
