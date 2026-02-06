import { Config, Help } from "@oclif/core";

export default class CustomHelp extends Help {
  showCommandHelp(command) {
    //		console.log("This will be displayed in single-command CLIs");
    super.showCommandHelp(command);
  }

  async showHelp(argv) {
    //    console.log('This will be displayed in multi-command CLIs')
    // Always include --all flag to show all commands
    await super.showHelp([...argv, "--all"]);
  }
}
