import Command from "#src/procaCommand.mjs";
import WidgetList from "../../widget/list.mjs";

export default class CampaignWidgetList extends Command {
  static description = "List widgets in a campaign";
  static args = this.multiid();

  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ multiid: true }),
  };

  async run() {
    const { flags } = await this.parse();

    // Delegate to widget list, but with campaign pre-filled
    await WidgetList.run(["--campaign", flags.name], this.config);
  }
}
