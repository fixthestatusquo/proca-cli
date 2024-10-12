import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export default class UserList extends Command {
	actionTypes = new Set();

	static description = "list all the users";

	static examples = ["<%= config.bin %> <%= command.id %> %pizza%"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		org: Flags.string({
			char: "o",
			description: "organisation",
			required: true,
		}),
	};

	fetch = async (org) => {
		const SearchUsersDocument = gql`
query ($org: String!) {
  users(select: {orgName: $org}) {
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
      role org {name}
    }
  }
}
    `;
		const result = await query(SearchUsersDocument, { org: org });
		return result.users;
		//return result.users.map (d => {d.config = JSON.parse(d.config); return d});
	};

	simplify = (d) => {
		const result = {
			id: d.id,
			email: d.email,
		};
		result.role = d.roles.filter((d) => d.org.name === this.flags.org)[0].role;
		if (d.isAdmin) {
			result.superadmin = true;
		}
		if (d.apiToken) {
			result.tokenExpire = d.apiToken.tokenExpire;
		}

		return result;
	};

	async run() {
		const { args, flags } = await this.parse(UserList);
		let data = [];

		data = await this.fetch(flags.org);

		return this.output(data);
	}
}
