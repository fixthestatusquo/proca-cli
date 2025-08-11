import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

const SERVICE_NAMES = [
	"MAILJET",
	"SES",
	"STRIPE",
	"TEST_STRIPE",
	"SYSTEM",
	"WEBHOOK",
	"SUPABASE",
	"SMTP",
].map((d) => d.toLowerCase());

export default class Actionconfirm extends Command {
	static description = "Should the supporter confirm the action?";

	static flags = {
		...super.globalFlags,
		org: Flags.string({
			aliases: ["name", "o"],
			description: "organisation collecting the action",
			required: true,
		}),
		confirm: Flags.boolean({
			description: "should the supporters confirm each action",
			default: true,
		}),
		template: Flags.string({
			description: "template for sending the message",
		}),
	};

	async mutate(flags) {
		const Document = gql`
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
		const result = await mutation(Document, {
			name: flags.org,
			confirm: flags.confirm,
			template: flags.template,
		});
		return result.updateOrgProcessing;
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
