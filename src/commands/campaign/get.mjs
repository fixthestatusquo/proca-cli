import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import {
	FragmentOrg,
	FragmentStats,
	FragmentSummary,
} from "#src/queries/campaign.mjs";
import { gql, query } from "#src/urql.mjs";

export default class CampaignGet extends Command {
	actionTypes = new Set();

	static args = {};

	static description = "view a campaign";

	static examples = ["<%= config.bin %> <%= command.id %> -i 42"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		id: Flags.string({
			char: "i",
			parse: (input) => {
				return Number.parseInt(input, 10);
			},
			description: "id of the campaign",
			exactlyOne: ["id", "name"],
			helpValue: "<organisation name>",
		}),
		name: Flags.string({
			char: "n",
			description: "name of the campaign",
			helpValue: "<campaign name>",
		}),
		config: Flags.boolean({
			description: "display the config",
			default: false,
			allowNo: true,
		}),
		stats: Flags.boolean({
			description: "display the stats",
			default: true,
			allowNo: true,
		}),
		locale: Flags.string({
			description: "display a locale",
		}),
	};

	Get = async (id, name) => {
		const GetCampaignDocument = gql`
      query GetCampaign($id: Int, $name: String, $withStats: Boolean = false) {
        campaign (name: $name, id: $id) {
          ...Summary
          ...Org
          config
          ...Stats @include(if: $withStats)
        }
      }
      ${FragmentStats}
      ${FragmentSummary}
      ${FragmentOrg}
    `;
		const result = await query(GetCampaignDocument, {
			id: id,
			name: name,
			withStats: this.flags.stats,
		});
		return result.campaign;
	};

	simplify = (d) => {
		const result = {
			id: d.id,
			Name: d.name,
			Title: d.title,
			Org: d.org.name,
			Status: d.status,
			locales: d.config.locales && Object.keys(d.config.locales).join(" "),
			journey: d.config.journey?.join(" → "),
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
		super.table(this.simplify(r), null, null);
		if (this.flags.locale) {
			this.prettyJson(r.config.locales[this.flags.locale]);
		}
		if (this.flags.config) {
			r.config.locales = undefined;
			this.prettyJson(r.config);
		}
	};

	async run() {
		const { args, flags } = await this.parse();

		const data = await this.Get(flags.id, flags.name);
		if (this.flags.stats) {
			data.stats.actionCount.forEach((d) => {
				//skip share_confirmed?
				this.actionTypes.add(d.actionType);
			});
		}
		return this.output(data);
	}
}
