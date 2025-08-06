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

export default class OrgEmail extends Command {
	static description = "Set service, usually email backend for an org";

	static args = this.multiid();
	static flags = {
		...super.globalFlags,
		org: Flags.string({
			aliases: ["name", "o"],
			description: "organisation running the service",
			required: true,
		}),
		mailer: Flags.string({
			description: "service to send emails",
			options: SERVICE_NAMES,
			required: true,
			default: "system",
		}),
		from: Flags.string({
			description: "Email address to send from (default: <org>@proca.app)",
		}),
	};

	async mutate(flags) {
		flags.from = flags.from || `${flags.org}@proca.app`;

		const Document = gql`
    mutation UpdateOrgProcessing(
      $name: String!
      $emailBackend: ServiceName!
      $emailFrom: String!
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
		const result = await mutation(Document, {
			name: flags.org,
			emailBackend: flags.mailer.toUpperCase(),
			emailFrom: flags.from,
		});
		return result.updateOrgProcessing;
	}

	simplify = (d) => ({
		id: d.id,
		name: d.name,
		mailer: d.processing.emailBackend,
		from: d.processing.emailFrom,
	});
	async run() {
		const { flags } = await this.parse();
		const result = await this.mutate(flags);

		this.output(result);
	}
}
