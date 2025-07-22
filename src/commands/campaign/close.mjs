import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import OrgGet from "#src/commands/org/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";
import { getTwitter } from "#src/util/twitter.mjs";

export default class CampaignClose extends Command {
	static args = {
		title: Args.string({
			description: "title of the campaign",
			multiple: true,
		}),
	};
	//  static strict = false;

	static examples = ["<%= config.bin %> <%= command.id %> -name <campaign>"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		name: Flags.string({
			char: "n",
			description: "name of the campaign",
			helpValue: "<campaign name>",
			required: true,
		}),
		org: Flags.string({
			char: "o",
			description: "name of the coordinator",
			helpValue: "<org name>",
			required: true,
		}),
		status: Flags.string({
			description: "status",
			required: true,
			options: ["closed", "ignored", "live"],
			default: "closed",
		}),
	};

	updateStatus = async (props) => {
		const org = await this.getOrg(props.org);

		const Query = gql`
mutation ($org: String!
$name: String!
$status: String!
) {
  upsertCampaign (input: { name: $name, status: $status }, orgName: $org) {
    name
    title
    status
    config
  }
}
    `;
		const result = await mutation(Query, {
			org: props.org,
			name: props.name,
			status: props.status.toUpperCase(),
		});

		console.log("result", result);
		return result;
	};

	async getOrg(orgName) {
		const { config } = this;
		const orgGet = new OrgGet({}, this.config);
		const org = await orgGet.fetch({ name: orgName });
		return org;
	}

	async run() {
		const { args, flags } = await this.parse();

		const data = await this.updateStatus(flags);
		return this.output(data);
	}
}
