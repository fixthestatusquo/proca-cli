import WidgetList from "#src/commands/widget/list.mjs";
import WidgetRebuild from "#src/commands/widget/rebuild.mjs";
import Command from "#src/procaCommand.mjs";

export default class CampaignWidgetRebuild extends Command {
  static description = "(re)build all the widgets of a campaign";

  static examples = ["$ proca-cli campaign widget rebuild climate-action"];

  static args = this.multiid();

  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ multiid: true }),
    //    dryRun: Flags.boolean({
    //      description: 'Show what would be rebuilt without actually doing it',
    //    }),
  };

  simplify = (d) => {
    d.location = undefined;
    d.config = undefined;
    d.org = d.org.name;
    return d;
  };

  table = (r) => {
    super.table(r, null, null);
  };

  rebuild = async (props) => {
    const wapi = new WidgetList();
    const rebuildapi = new WidgetRebuild();
    wapi.flags.config = true; //we need to fetch each widget config
    const widgets = await wapi.fetchCampaign(props.name); //list all widgets
    const result = [];
    for (const widget of widgets) {
      // do not process all widgets in parallel but in sequence
      const r = await rebuildapi.rebuild({ widget });
      result.push(r);
    }
    return result;
  };

  async run() {
    const { flags } = await this.parse();
    const r = await this.rebuild(flags);
    return this.output(r);
  }
}
