import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
//import {FragmentSummary,} from "#src/queries/org.mjs";
import { gql, query } from "#src/urql.mjs";

export default class OrgGet extends Command {
	static args = {};

	static description = "view a org";

	static examples = ["<%= config.bin %> <%= command.id %> <name of the ngo>"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		name: Flags.string({
			char: "n",
			charAliases: ["o"],
			description: "name of the org",
			helpValue: "<org name>",
		}),
		config: Flags.boolean({
			description: "display the config",
			default: false,
			allowNo: true,
		}),
		keys: Flags.boolean({
			default: true,
			allowNo: true,
		}),
		campaigns: Flags.boolean({
			default: false,
			allowNo: true,
		}),
		widgets: Flags.boolean({
			default: true,
			allowNo: true,
		}),
		users: Flags.boolean({
			default: true,
			allowNo: true,
		}),
	};

	fetch = async (params) => {
		const GetOrgDocument = gql`
      query GetOrg($name: String!, $withCampaigns: Boolean = true) {
        org (name: $name) {
          id name title
          config
          campaigns @include(if: $withCampaigns) {id, name, title, org {name}}
        }
      }
    `;
		const result = await query(GetOrgDocument, {
			name: params.name,
			withCampaigns: params.campaigns,
		});
		return result.org;
	};

	simplify = (d) => {
		const result = {
			id: d.id,
			Name: d.name,
			Title: d.title,
		};
		if (this.flags.stats) {
			result["#Supporters"] = d.stats.supporterCount;

			this.actionTypes.forEach((type) => {
				const action = d.stats.actionCount.find(
					(action) => action.actionType === type,
				);
				if (action) result[`#${type}`] = action.count;
			});
		}
		return result;
	};

	table = (r) => {
		r.config = JSON.parse(r.config);
		super.table(r, null, null);
		if (this.flags.config) {
			r.config.locales = undefined;
			this.prettyJson(r.config);
		}
	};

	async run() {
		const { args, flags } = await this.parse();
		const data = await this.fetch(flags);
		return this.output(data);
	}
}
