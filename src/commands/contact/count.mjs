import { Args, Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export default class CounterGet extends Command {
  static description = "counter of supporters";

  static examples = [
    "<%= config.bin %> <%= command.id %> --id <id of the campaign>",
    "<%= config.bin %> <%= command.id %> --name <name of the campaign>",
  ];

  static args = this.multiid();
  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ multiid: true }),
  };

  fetch = async (params) => {
    const GetCounterDocument = gql`
      query GetCounter($name: String, $id: Int) {
        campaign(name: $name, id: $id) {
          stats {
            supporterCount
          }
        }
      }
    `;
    const result = await query(GetCounterDocument, params);
    return result.campaign.stats;
  };

  table = (r) => {
    super.table(r, null, null);
  };

  async run() {
    const { args, flags } = await this.parse();
    const data = await this.fetch(flags);
    return this.output(data);
  }
}
