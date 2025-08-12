import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import getCurrentUser from "#src/commands/config/user.mjs";
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
		user: Flags.string({
			char: "u",
			description: "email",
			helpValue: "<user email>",
		}),
		org: Flags.string({
			char: "o",
			description: "name of the org",
			required: true,
			helpValue: "<org name>",
		}),
	};

	mutate = async ({ user, org }) => {
		const Document = gql`
mutation ($email: String!, $org: String!) {
  deleteOrgUser(email: $email, orgName: $org) { status }
}`;
		const result = await mutation(Document, {
			email: user,
			org: org,
		});
		return result.deleteOrgUser;
	};

	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		const { args, flags } = await this.parse();
		if (!flags.user) {
			const me = await this.getCurrentUser();
			flags.user = me.email;
		}
		const data = await this.mutate(flags);
		this.output(data);
	}
}
