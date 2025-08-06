import { Flags } from "@oclif/core";
import Org from "#src/commands/org/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

export default class OrgServices extends Command {
	static description = "list services set for an organisation";

	static flags = {
		...super.globalFlags,
		org: Flags.string({
			char: "o",
			description: "organisation running the service",
			required: true,
		}),
	};

	async run() {
		const { flags } = await this.parse();
		const orgCmd = new Org({}, this.config);
		const org = await orgCmd.fetch({ name: flags.org });
		this.output(org.services);
	}
}
