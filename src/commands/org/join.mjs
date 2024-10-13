import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class UserJoinOrg extends Command {
	static description = "let a user join an organisation with a role";

	static examples = ["<%= config.bin %> <%= command.id %>"];

	static flags = {
		...super.globalFlags,
		user: Flags.string({ description: "user email" }),
		role: Flags.string({
			description: "permission level in that org",
			options: ["owner", "campaigner", "coordinator", "translator"],
		}),
		org: Flags.string({
			char: "o",
			description: "name of the org",
			helpValue: "<org name>",
		}),
	};

	mutate = async (params) => {
		const Document = gql`
mutation ($org: String!, $user: String!, $role: String = "campaigner") {
  addOrgUser (orgName: $org, input : { email: $user, role: $role }) {
    status
  }
}
    `;
		const result = await mutation(Document, {
			user: params.user,
			org: params.org,
			role: params.role,
		});
		console.log(result);
		return result.status;
		//return result.users.map (d => {d.config = JSON.parse(d.config); return d});
	};

	async run() {
		console.log("WIP, probably not working");
		const { args, flags } = await this.parse();

		data = await this.mutate(flags);
		console.log(data);
	}
}
