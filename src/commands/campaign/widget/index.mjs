import { Command } from "@oclif/core";

export default class CampaignWidget extends Command {
  static description = "commands for multiple widgets in a campaign";
  static aliases = ["campaign:widget"];
  static hidden = true; // Hide from command list, only show as topic

  static id = "campaign:widget";

  async run() {
    const { Help } = await import("@oclif/core");
    const help = new Help(this.config, { all: true });
    const formatted = help.formatCommand(this);
    this.log(formatted);
    //    this.error("Please specify a subcommand, run with --help to list them");
  }
}
