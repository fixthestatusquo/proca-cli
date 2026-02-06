import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import {
  FragmentOrg,
  FragmentStats,
  FragmentSummary,
} from "#src/queries/campaign.mjs";
import { gql, query } from "#src/urql.mjs";

export const getCampaignList = (params) => {
  const d = new CampaignList([]);
  return d.OrgSearch(params);
};

export default class CampaignList extends Command {
  actionTypes = new Set();

  static description = "list all the campaigns";

  //  static args = this.multiid();

  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ name: "name of the organisation" }),
    title: Flags.string({
      char: "t",
      description: "name of the campaign",
      helpValue: "<campaign title>",
      multiple: true,
    }),
    stats: Flags.boolean({
      description: "display the stats",
      default: true,
      allowNo: true,
    }),
  };

  OrgSearch = async (name) => {
    const SearchCampaignsDocument = gql`
      query SearchCampaigns($org: String!, $withStats: Boolean = false) {
        org (name:$org) {
        campaigns {
          ...Summary
          ...Org
          ...Stats @include(if: $withStats)
        }
        }
      }
      ${FragmentStats}
      ${FragmentOrg}
      ${FragmentSummary}
    `;
    const result = await query(SearchCampaignsDocument, {
      org: name,
      withStats: this.flags.stats,
    });
    return result.org.campaigns;
    //return result.campaigns.map (d => {d.config = JSON.parse(d.config); return d});
  };

  Search = async (title) => {
    const SearchCampaignsDocument = gql`
      query SearchCampaigns($title: String!, $withStats: Boolean = false) {
        campaigns(title: $title) {
          ...Summary
          ...Org
          ...Stats @include(if: $withStats)
        }
      }
      ${FragmentStats}
      ${FragmentOrg}
      ${FragmentSummary}
    `;
    const result = await query(SearchCampaignsDocument, {
      title: title,
      withStats: this.flags.stats,
    });
    return result.campaigns;
    //return result.campaigns.map (d => {d.config = JSON.parse(d.config); return d});
  };

  simplify = (d) => {
    const result = {
      id: d.id,
      Name: d.name,
      Title: d.title,
      Org: d.org.name,
      Status: d.status,
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
    super.table(r, null, (table) => table.sort(["id|des"]).toString());
  };

  async run() {
    const { flags } = await this.parse(CampaignList);
    let data = [];

    if (!flags.title && !flags.name) {
      throw new Error(
        `${this.id} -t [title of the campaign] or -o [organisation]`,
      );
    }

    if (flags.title) {
      data = await this.Search(flags.title.join(" "));
      if (this.flags.stats) {
        data.forEach((d) => {
          d.stats.actionCount.forEach((d) => {
            //skip share_confirmed?
            this.actionTypes.add(d.actionType);
          });
        });
      }
    }

    if (flags.name) {
      data = await this.OrgSearch(flags.name);
      if (this.flags.stats) {
        data.forEach((d) => {
          d.stats.actionCount.forEach((d) => {
            //skip share_confirmed?
            this.actionTypes.add(d.actionType);
          });
        });
      }
    }
    return this.output(data);
  }
}
