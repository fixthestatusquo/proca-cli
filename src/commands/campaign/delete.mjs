import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class CampaignDelete extends Command {
  static args = this.multiid();

  static description = "delete a campaign";
  static examples = [
    "<%= config.bin %> <%= command.id %> 42",
    "<%= config.bin %> <%= command.id %> -i 42",
    "<%= config.bin %> <%= command.id %> my_campaign",
    "<%= config.bin %> <%= command.id %> -n my_campaign",
  ];

  static flags = {
    ...this.flagify({ multiid: true }),
  };

  mutate = async ({ id, name }) => {
    const Document = gql`
      mutation ($id: Int, $name: String) {
        deleteCampaign(id: $id, name: $name)
      }
    `;
    const result = await mutation(Document, { id, name });
    return result.deleteCampaign;
  };

  async run() {
    const { flags } = await this.parse();
    const { id, name } = flags;

    if (!id && !name) {
      this.error("You must specify a campaign id or name");
    }

    const data = await this.mutate({ id, name });
    return this.output(data);
  }
}
