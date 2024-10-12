import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export default class UserList extends Command {
	static description = "fetch the information about a user";

	static examples = ["<%= config.bin %> <%= command.id %>"];

	static flags = {
		...super.globalFlags,
		email: Flags.string({ description: "user email" }),
		org: Flags.string({
			char: "o",
			description: "name of the org",
			exactlyOne: ["email", "id", "org"],
			helpValue: "<org name>",
		}),
		id: Flags.string({
			char: "i",
			parse: (input) => {
				return Number.parseInt(input, 10);
			},
			description: "id of the user",
		}),
	};

	fetch = async (params) => {
		const Document = gql`
query ($email: String, $org: String, $id: Int) {
  users (select: {email: $email, orgName: $org, id: $id}) {
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
		const result = await query(Document, {
			org: params.org,
			id: params.id,
			email: params.email,
		});
		return result.users[0];
	};

	simplify = (d) => {
		const result = {
			id: d.id,
			email: d.email,
		};
		if (d.apiToken) {
			result.tokenExpire = d.apiToken.expire;
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

		data = await this.fetch(flags);
		return this.output(data);
	}
}
