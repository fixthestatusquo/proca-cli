import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import CampaignGet from "#src/commands/campaign/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class WidgetAdd extends Command {
	//static args = { path: { description: "" } };

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		campaign: Flags.string({
			char: "c",
			required: true,
			description: "name of the campaign",
			helpValue: "<campaign name>",
		}),
		org: Flags.string({
			char: "o",
			description: "organisation",
			helpValue: "<en>",
		}),
		lang: Flags.string({
			char: "l",
			description: "language",
			default: "en",
			helpValue: "<en>",
		}),
		name: Flags.string({
			char: "n",
			description: "url slug",
			helpValue: "by default  <campaign>/<org>/<lang>",
		}),
	};

	create = async (flag) => {
		const orgName = flag.org;
		let campaign = { org: { name: orgName } }; // no need to fetch the campaign if the orgName is specified

		const addWidgetDocument = gql`
      mutation addPage(
        $campaign: String!
        $org: String!
        $name: String!
        $lang: String!
      ) {
        addActionPage(
          campaignName: $campaign
          orgName: $org
          input: { name: $name, locale: $lang }
        ) {
          id
        }
      }
    `;

		if (!orgName) {
			try {
				const campapi = new CampaignGet();
				campaign = await campapi.fetch({ name: flag.campaign });
				flag.org = campaign.org.name;
			} catch (e) {
				console.log("error", e);
				throw e;
			}
		}

		if (!campaign) {
			throw new Error(`campaign not found: ${flag.campaign}`);
		}

		try {
			const r = await mutation(addWidgetDocument, flag);
			return r;
		} catch (e) {
			const errors = e.graphQLErrors;
			if (errors[0].path[1] === "name") {
				this.error(`invalid name (already taken?): ${flag.name}`);
				throw new Error(errors[0].message);
			}
			if (r.errors[0].extensions?.code === "permission_denied") {
				console.error("permission denied to create", name, campaign?.org.name);
				throw new Error(r.errors[0].message);
			}
			const page = await fetchByName(name);
			console.warn("duplicate of widget", page.id);
			throw new Error(r.errors[0].message);
		}
	};

	async run() {
		const { args, flags } = await this.parse();

		//		const org = { name: flags.twitter || flags.name, config: {} };

		const data = await this.create(flags);
		return this.output(data);
	}
}
