import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import OrgGet from "#src/commands/org/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";
import { getTwitter } from "#src/util/twitter.mjs";

export default class CampaignAdd extends Command {
	static args = {
		title: Args.string({
			description: "title of the campaign",
			multiple: true,
		}),
	};
	//  static strict = false;

	static examples = [
		"<%= config.bin %> <%= command.id %> -n <new_campaign> the full name of the campaign",
	];

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
	};

	create = async (campaign) => {
		const org = await this.getOrg(campaign.org);

		const config = {
			locales: {
				en: {
					"campaign:": {
						description: "",
					},
					"common:": {},
				},
			},
		};
		if (org.config.locale && org.config.locale !== "en") {
			config.locales[org.config.locale] = {};
		}
		if (!config.portal) {
			config.portal = [];
		}
		const AddOrgDocument = gql`
mutation ($org: String!
$name: String!
$title: String!
$config: Json!
) {
  addCampaign (input: { name: $name, title: $title, config: $config }, orgName: $org) {
    name
    title
    config
  }
}
    `;
		const result = await mutation(AddOrgDocument, {
			org: org.name,
			name: campaign.name,
			title: campaign.title,
			config: JSON.stringify(config),
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
		//const { args, flags } = await this.parse(CampaignAdd);
		const { args, flags } = await this.parse();

		const campaign = {
			org: flags.org,
			name: flags.name,
			title: args.title || flags.name,
		};

		const data = await this.create(campaign);
		return this.output(data);
	}
}
