import { Flags } from "@oclif/core";
import { getWidget } from "#src/commands/widget/get.mjs";
import UpdateCommand from "#src/commands/widget/update/index.mjs";

export default class CounterUpdate extends UpdateCommand {
  static description = "Update the name of a widget";

  static examples = [
    "see also <%= config.bin %> widget update name --name=campaign/old_name --rename=campaign/new_name",
  ];
  static args = this.multiid();

  static flags = {
    ...this.flagify({ multiid: true }),
    rename: Flags.string({
      description: "new name for the widget",
      helpValue: "<widget name>",
    }),
  };

  async run() {
    const { flags } = await this.parse();
    const widget = await getWidget(flags);

    const updated = await this.update(widget.id, { name: flags.rename });
    return this.output(updated, { single: true });
  }
}
