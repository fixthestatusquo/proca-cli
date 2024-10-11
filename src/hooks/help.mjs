import { Config, Help } from "@oclif/core";

console.log("help command");

export default class CustomHelp extends Help {
	async showHelp(argv) {
		// Always include --all flag to show all commands
		await super.showHelp([...argv, "--all"]);
	}
}
