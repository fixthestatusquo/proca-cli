import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class OrgLeave extends Command {
	actionTypes = new Set();

	static args = {};

	static description = "leave a org";

	static examples = ["<%= config.bin %> <%= command.id %> -i 42"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		email: Flags.string({
			description: "email",
			required: true,
			helpValue: "<user email>",
		}),
		org: Flags.string({
			char: "o",
			description: "name of the org",
			required: true,
			helpValue: "<org name>",
		}),
	};

	mutate = async ({ email, org }) => {
		const Document = gql`
mutation ($email: String!, $org: String!) {
  deleteOrgUser(email: $email, orgName: $org) { status }
}`;
		const result = await mutation(Document, {
			email: email,
			org: org,
		});
		return result.deleteOrgUser.status;
	};

	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		const { args, flags } = await this.parse();
		const data = await this.mutate(flags);
		return data;
	}
}
