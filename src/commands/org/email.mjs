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
];

export default class OrgEmail extends Command {
	static description = "Set email backend for an org";

	static flags = {
		...super.globalFlags,
		name: Flags.string({
			char: "n",
			required: true,
			description: "Name of the org",
		}),
		emailBackend: Flags.string({
			description: "Email backend to use",
			options: SERVICE_NAMES,
			helpValue: SERVICE_NAMES,
			default: "MAILJET",
		}),
		emailFrom: Flags.string({
			description: "Email address to send from (default: <org>@proca.app)",
		}),
	};

	async run() {
		const { flags } = await this.parse();

		const orgName = flags.name;

		const emailFrom = flags.emailFrom ?? `${orgName}@proca.app`;

		const Document = gql`
    mutation UpdateOrgProcessing(
      $name: String!
      $emailBackend: ServiceName
      $emailFrom: String
    ) {
      updateOrgProcessing(
        name: $name
        emailBackend: $emailBackend
        emailFrom: $emailFrom
      ) {
        id
        name
        processing {
          emailBackend
          emailFrom
        }
      }
    }
  `;
		console.log("vvvvvvv", flags.emailBackend);
		const result = await mutation(Document, {
			name: orgName,
			emailBackend: flags.emailBackend,
			emailFrom,
		});

		this.output(result.updateOrg);
	}
}
