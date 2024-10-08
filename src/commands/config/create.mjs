import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/command.mjs";
import { get as getConfig } from "#src/config.mjs";

export default class CampaignList extends Command {
	static enableJsonFlag = true;

	static args = {
		environment: Args.string({
			description: "environment",
			default: "default",
		}),
	};

	static description = "create setting to access the server authentication";

	static examples = [
		"<%= config.bin %> <%= command.id %> --user=xavier@example.org --token=API-12345789",
	];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		user: Flags.string({
			char: "u",
			description: "username on proca server",
			helpValue: "<email>",
			required: true,
		}),
		token: Flags.string({
			char: "u",
			description: "user token on proca server",
			helpValue: "<API-token>",
			required: true,
		}),
	};

	Search = async (title) => {
		const FragmentSummary = gql`fragment Summary on Campaign {id name title externalId status}`;

		const org = gql`
      fragment OrgSummary on Campaign {
        org {
          id
          name
          title
          externalId
          status
        }
      }
    `;
		const FragmentStats = gql`
      fragment Stats on Campaign {
        stats {
          supporterCount
          actionCount {actionType count}
        }
      }
    `;
		const SearchCampaignsDocument = gql`
      query SearchCampaigns($title: String!, $includeStats: Boolean = false) {
        campaigns(title: $title) {
          ...Summary
          org {
            name
            title
          }
          ...Stats @include(if: $includeStats)
        }
      }
      ${FragmentStats}
      ${FragmentSummary}
    `;
		const result = await query(SearchCampaignsDocument, {
			title: title,
			includeStats: this.flags.stats,
		});
		this.info("found", result.campaigns.length);
		return result.campaigns;
		//return result.campaigns.map (d => {d.config = JSON.parse(d.config); return d});
	};

	table = (r) => {
		const actionTypes = new Set();
		if (this.flags.stats) {
			r.forEach((d) => {
				d.stats.actionCount.forEach((d) => {
					//skip share_confirmed?
					actionTypes.add(d.actionType);
				});
			});
			//console.log(actionTypes);
		}
		super.table(
			r,
			(d, cell) => {
				cell("ID", d.id);
				cell("Name", d.name);
				cell("Title", d.title);
				cell("Org", d.org.name);
				cell("Status", d.status);
				if (this.flags.stats) {
					cell("#Supporters", d.stats.supporterCount);
					actionTypes.forEach((type) => {
						const action = d.stats.actionCount.find(
							(action) => action.actionType === type,
						);
						if (action) cell(`#${type}`, action.count);
					});
				}
			},
			(table) => table.sort(["ID"]).toString(),
		);
	};

	async run() {
		const { args, flags } = await this.parse(CampaignList);

		if (args.title && flags.title) {
			throw new Error(
				`${this.id} EITHER [title of the campaign] OR --title [title of the campaign]`,
			);
		}
		if (args.title) {
			flags.title = args.title;
		}

		if (!flags.title && !flags.org) {
			throw new Error(
				`${this.id} -t [title of the campaign] or -o [organisation]`,
			);
		}

		if (flags.title) {
			const data = await this.Search(flags.title);
			return this.output(data);
		}
	}
}
