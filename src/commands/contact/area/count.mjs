import { Args, Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export default class AreaCounterGet extends Command {
  static description =
    "counter of supporters by area (country), disabled for performance reasons";
  static hidden = false;
  static examples = [
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
            supporterCountByArea {area, count}
          }
        }
      }
    `;
    const result = await query(GetCounterDocument, params);
    return result.campaign.stats.supporterCountByArea;
  };

  async run() {
    const { flags } = await this.parse();
    const data = await this.fetch(flags);
    return this.output(data);
  }
}
