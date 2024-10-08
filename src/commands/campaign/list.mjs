import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/command.mjs";
import { gql, query } from "#src/urql.mjs";

export default class CampaignList extends Command {
	static enableJsonFlag = true;

	static args = {
		title: Args.string({ description: "name of the campaign, % for wildchar" }),
	};

	static description = "list all the campaigns";

	static examples = ["<%= config.bin %> <%= command.id %> %pizza%"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		org: Flags.string({
			char: "o",
			description: "organisation coordinating the campaigns",
			exclusive: ["title"],
			helpValue: "<organisation name>",
		}),
		title: Flags.string({
			char: "t",
			description: "name of the campaign, % for wildchar",
			exclusive: ["org"],
			helpValue: "<campaign title>",
		}),
	};

	Search = async (title) => {
		const summary = gql`
      fragment CampaignSummary on Campaign {
        name
        title
      }
    `;
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
		const stats = gql`
      fragment CampaignStats on Campaign {
        stats {
          supporterCount
          actionCount
        }
      }
    `;
		const SearchCampaignsDocument = gql`
      query SearchCampaigns($title: String!) {
        campaigns(title: $title) {
          id
          name
          title
          externalId
          org {
            name
            title
          }
          status
        }
      }
    `;
		const result = await query(SearchCampaignsDocument, { title: title });
		this.info("found", result.campaigns.length);
		return result.campaigns;
		//return result.campaigns.map (d => {d.config = JSON.parse(d.config); return d});
	};

	table = (r) => {
		super.table(
			r,
			(d, cell) => {
				cell("ID", d.id);
				cell("Name", d.name);
				cell("Title", d.title);
				cell("Org", d.org.name);
				cell("Status", d.status);
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
