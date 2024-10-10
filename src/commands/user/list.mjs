import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export default class UserList extends Command {
	actionTypes = new Set();

	static args = {
		title: Args.string({ description: "name of the user, % for wildchar" }),
	};

	static description = "list all the users";

	static examples = ["<%= config.bin %> <%= command.id %> %pizza%"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		id: Flags.string({
			char: "i",
			parse: (input) => {
				return Number.parseInt(input, 10);
			},
			description: "identifier",
			exactlyOne: ["id", "email", "orgName"],
			helpValue: "<42>",
		}),
		email: Flags.string({
			description: "email of the user",
			exclusive: ["orgName", "id"],
			helpValue: "<jane@example.org>",
		}),
		orgName: Flags.string({
			char: "o",
			description: "organisation",
		}),
	};

	Search = async (params) => {
		const SearchUsersDocument = gql`
query ($select: SelectUser) {
  users(select: $select) {
    apiToken {
      expiresAt
    }
    email
    id
    isAdmin
    jobTitle
    phone
    pictureUrl
    roles {
      role
    }
  }
}
    `;
		const result = await query(SearchUsersDocument, { select: params });
		console.log(result);
		return result.users;
		//return result.users.map (d => {d.config = JSON.parse(d.config); return d});
	};

	async run() {
		const { args, flags } = await this.parse(UserList);
		let data = [];

		data = await this.Search(flags);

		return this.output(data);
	}
}
