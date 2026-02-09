import { Flags } from "@oclif/core";
import { getCampaign } from "#src/commands/campaign/get.mjs";
import Command from "#src/procaCommand.mjs";

import { gql, query } from "#src/urql.mjs";

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
      query GetCounter($name: String, $id: Int) {
        campaign(name: $name, id: $id) {
          stats {
            supporterCount
          }
        }
      }
    `;
    return GetCounterDocument;
  };

  fetch = async (params) => {
    const GetCounterDocument = this.getDoc();
    const result = await query(GetCounterDocument, params);
    return result.campaign.stats;
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

    const data = await this.fetch(flags);
    return this.output(data);
  }
}
