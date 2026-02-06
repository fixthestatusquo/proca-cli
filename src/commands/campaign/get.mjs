import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import {
  FragmentMtt,
  FragmentOrg,
  FragmentStats,
  FragmentSummary,
} from "#src/queries/campaign.mjs";
import { gql, query } from "#src/urql.mjs";

export const getCampaign = (params) => {
  const d = new CampaignGet([]);
  return d.fetch(params);
};

export default class CampaignGet extends Command {
  actionTypes = new Set();

  static args = this.multiid();

  static description = "view a campaign";

  static examples = ["<%= config.bin %> <%= command.id %> -i 42"];

  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ multiid: true }),
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

  fetch = async ({ id, name }) => {
    const GetCampaignDocument = gql`
      query GetCampaign($id: Int, $name: String, $withStats: Boolean = false) {
        campaign (name: $name, id: $id) {
          ...Summary
          ...Org
          config
          ...Stats @include(if: $withStats)
          ...Mtt
        }
      }
      ${FragmentStats}
      ${FragmentSummary}
      ${FragmentOrg}
      ${FragmentMtt}
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
    if (d.mtt) {
      // we have an mtt
      const hhmm = (date) =>
        new Date(date).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      result.from = d.mtt.startAt.substring(0, 10);
      result.to = d.mtt.endAt.substring(0, 10);
      result.period = `${hhmm(d.mtt.startAt)}↔${hhmm(d.mtt.endAt)}`;
      result["test email"] = d.mtt.testEmail;
      result["mtt template"] = d.mtt.template;
      result["cc contacts"] = d.mtt.ccContacts?.join(", ");
      result["cc sender"] = d.mtt.ccSender;
      result["drip delivery"] = d.mtt.dripDelivery;
    }
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
    if (this.flags.locale) {
      this.prettyJson(r.config?.locales[this.flags.locale]);
    }
    if (this.flags.config) {
      r.config.locales = undefined;
      this.prettyJson(r.config);
    }
  };

  async run() {
    const { args, flags } = await this.parse();

    const data = await this.fetch({ id: flags.id, name: flags.name });
    if (this.flags.stats) {
      data.stats.actionCount.forEach((d) => {
        //skip share_confirmed?
        this.actionTypes.add(d.actionType);
      });
    }
    return this.output(data);
  }
}
