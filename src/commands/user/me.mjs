import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export default class UserList extends Command {
	static description =
		"fetch the information about the current user (based on the token)";

	static examples = ["<%= config.bin %> <%= command.id %>"];

	static flags = {
		...super.globalFlags,
	};

	fetch = async (params) => {
		const Document = gql`
query  {
  currentUser {
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
		const result = await query(Document);
		return result.currentUser;
		//return result.users.map (d => {d.config = JSON.parse(d.config); return d});
	};

	simplify = (d) => {
		console.log(d);
		const result = {
			id: d.id,
			email: d.email,
		};
		if (d.apiToken) {
			result.tokenExpire = "2024-11-09T11:22:22";
		}
		if (d.isAdmin) {
			result.admin = true;
		}
		const roles = d.roles.reduce((acc, item) => {
			if (!acc[item.role]) {
				acc[item.role] = [];
			}
			acc[item.role].push(item.org.name);
			return acc;
		}, {});
		for (const role in roles) {
			result[role] = roles[role].join(",");
		}
		return result;
	};

	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		const { args, flags } = await this.parse();
		let data = [];

		data = await this.fetch();

		return this.output(data);
	}
}
