import { Flags } from "@oclif/core";
import { getCampaign } from "#src/commands/campaign/get.mjs";
import Command from "#src/procaCommand.mjs";

import { gql, query } from "#src/urql.mjs";
export const getCount = async (config) => {
  const d = new CounterGet([]);
  if (!config) {
    console.warn("missing config");
    return undefined;
  }
  if (config.excludeWidget && !config.widgetId) {
    config.widgetId = config.excludeWidget;
  }
  if (config.campaign) {
    if (Number.isNaN(config.campaign)) {
      config.name = config.campaign;
    } else {
      config.id = config.campaign;
    }
  }
  return d.fetch(config);
};

export default class CounterGet extends Command {
  static description = "counter of supporters of a campaign";

  static examples = [
    "<%= config.bin %> <%= command.id %> --name <name of the campaign>",
  ];

  static args = this.multiid();
  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ multiid: true, name: "campaign" }),
    query: Flags.boolean({
      description: "display the REST api query",
      default: false,
    }),
    "exclude-widget": Flags.integer({
      description:
        "subtract this widget's extraSupporters from the total (widget id)",
    }),
  };

  getMinifiedDoc = (id) => {
    const query = `{
    campaign(id: ${id}) {
      stats {
        supporterCount
      }
    }
  }`;
    return query
      .replace(/\s*([{}():,])\s*/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
  };

  getDoc = () => {
    const GetCounterDocument = gql`
      query GetCounter(
        $name: String
        $id: Int
        $widgetId: Int
        $excludeWidget: Boolean!
      ) {
        campaign(name: $name, id: $id) {
          stats {
            supporterCount
          }
        }
        actionPage(id: $widgetId)
          @include(if: $excludeWidget) {
          name
          ... on PrivateActionPage {
            extraSupporters
          }
        }
      }
    `;
    return GetCounterDocument;
  };

  fetch = async (params) => {
    const GetCounterDocument = this.getDoc();
    params.excludeWidget = params.widgetId !== undefined;
    const result = await query(GetCounterDocument, params);

    const data = result.campaign.stats;
    if (params.excludeWidget !== undefined) {
      data.all = data.supporterCount;
      data.widget = result.actionPage?.name;
      data.excluded = result.actionPage?.extraSupporters || 0;
      data.supporterCount -= data.excluded;
    }
    if (params.simplify === false) return data;
    return data.supporterCount;
  };

  table = (r) => {
    super.table(r, null, null);
  };

  async run() {
    const { flags } = await this.parse();
    if (flags.query) {
      const camp = await getCampaign(flags);
      const query = this.getMinifiedDoc(camp.id);
      return this.output({
        api: query,
        url: `${this.procaConfig.url}?query=${encodeURIComponent(query)}`,
      });
    }

    if (flags.simplify === undefined) flags.simplify = false;
    const result = await this.fetch({
      name: flags.name,
      id: flags.id,
      widgetId: flags["exclude-widget"],
      simplify: flags.simplify,
    });

    if (flags.simplify === true) return console.log(result);

    return this.output(result);
  }
}
