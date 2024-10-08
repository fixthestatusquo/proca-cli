import { Args, Command, Flags } from "@oclif/core";

export default class CampaignView extends Command {
	args = {
		file: Args.string({ description: "file to read" }),
	};

	description = "describe the command here";

	examples = ["<%= config.bin %> <%= command.id %>"];

	flags = {
		// flag with no value (-f, --force)
		force: Flags.boolean({ char: "f" }),
		// flag with a value (-n, --name=VALUE)
		name: Flags.string({ char: "n", description: "name to print" }),
	};

	async run() {
		const { args, flags } = await this.parse(CampaignView);

		const name = flags.name || "world";
		this.log(
			`hello ${name} from /var/www/proca-cli/src/commands/campaign/view.ts`,
		);
		if (args.file && flags.force) {
			this.log(`you input --force and --file: ${args.file}`);
		}
	}
}
