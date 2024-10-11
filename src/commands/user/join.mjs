import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class UserJoinOrg extends Command {
	static description = "let a user join an organisation with a role";

	static examples = ["<%= config.bin %> <%= command.id %>"];

	static flags = {
		...super.globalFlags,
		email: Flags.string({ description: "user email" }),
		role: Flags.string({ description: "owner, campaigner, coordinator" }),
		org: Flags.string({
			char: "o",
			description: "name of the org",
			helpValue: "<org name>",
		}),
	};

	mutate = async (params) => {
		const Document = gql`
mutation ($org:String!, $email:String!, $role = "campaigner") {
  addOrgUser (orgName: $org, input : { email: $email, role: $role } {
    status
  }
}
    `;
		const result = await mutate(Document);
		console.log(result);
		return result.status;
		//return result.users.map (d => {d.config = JSON.parse(d.config); return d});
	};

	async run() {
		const { args, flags } = await this.parse();
		let data = { email: flags.email, role: flags.role, org: flags.org };

		data = await this.mutation(data);
		console.log(data);
	}
}
