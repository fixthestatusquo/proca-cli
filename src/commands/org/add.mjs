import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";
import { getTwitter } from "#src/util/twitter.mjs";

export default class OrgAdd extends Command {
	static args = {};

	static examples = [
		"<%= config.bin %> <%= command.id %> --twitter <twitter of the organisation>",
	];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		twitter: Flags.string({
			description: "twitter account",
			helpValue: "<screen name>",
		}),
		name: Flags.string({
			char: "n",
			description: "name of the org",
			helpValue: "<org name>",
		}),
	};

	create = async (_org) => {
		const org = { ..._org, config: JSON.stringify(_org.config) };
		console.log(org);

		const AddOrgDocument = gql`
mutation ($org: OrgInput!) {
  addOrg(input: $org) {
    config
    name
    title
  }
}
    `;
		const result = await mutation(AddOrgDocument, {
			org,
		});
		if (!result.addOrg) {
			console.log(result);
			return result;
		}
		return result?.addOrg;
	};

	async run() {
		const { args, flags } = await this.parse();
		if (!flags.name && !flags.twitter) {
			this.error("You must provide either --name or --twitter");
		}

		const org = { name: flags.twitter || flags.name, config: {} };

		if (flags.twitter) {
			await getTwitter(org);
		}

		const data = await this.create(org);
		return this.output(data);
	}
}
