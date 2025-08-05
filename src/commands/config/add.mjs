import { Args, Flags } from "@oclif/core";
import { error, stdout } from "@oclif/core/ux";
import prompts from "prompts";
import { format, get as getConfig, getFilename, write } from "#src/config.mjs";
import Command from "#src/procaCommand.mjs";

export default class ConfigAdd extends Command {
	static enableJsonFlag = true;
	static aliases = ["config:setup", "config:init"];
	//	static deprecateAliases = true;

	static args = {
		...this.flagify({ multiid: false }),
	};

	static description = "create setting to access to a server";

	static examples = [
		"<%= config.bin %> <%= command.id %> --user=xavier@example.org --token=API-12345789",
	];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		url: Flags.string({
			description: "url of the proca server api",
			default: "https://api.proca.app/api",
			helpValue: "http://localhost:4000",
		}),
		token: Flags.string({
			description: "user token on proca server",
			helpValue: "API-token>",
		}),
		email: Flags.string({
			description: "user email on proca server",
			helpValue: "you@example.org",
		}),
		folder: Flags.string({
			description: "config folder (in the proca widget generator)",
			helpValue: "/var/www/proca/config.example",
		}),
		//		n8n: Flags.string({			description: "api access on the n8n server",			helpValue: "<n8n api>",		}),
		//		supabase: Flags.string({description: "url of the supabase",helpValue: "<url>"}),
		//		"supabase-anon-key": Flags.string({			description: "anonymous key",		}),
		//		"supabase-secrey-key": Flags.string({			description: "secret service key",		}),
	};

	generate = (flags) => {
		const mapping = {
			REACT_APP_NAME: "proca",
			REACT_APP_API_URL: flags.url,
			PROCA_TOKEN: flags.token,
			PROCA_CONFIG_FOLDER: flags.folder,
			N8N_TOKEN: flags.n8n,
			REACT_APP_SUPABASE_URL: flags.supabase,
			REACT_APP_SUPABASE_ANON_KEY: flags.supabase_anon_key,
			SUPABASE_SECRET_KEY: flags.supabase_secret_key,
		};

		return format(mapping);
	};

	async run() {
		const { args, flags } = await this.parse(this.constructor);

		const file = getFilename(this.config.configDir, flags.env);
		const userConfig = getConfig(file, true) || {};

		if (Object.keys(userConfig).length > 0) {
			this.log(`Config file ${file} exists. Using it to pre-fill values.`);
		}

		if (!flags.token) {
			const response = await prompts({
				type: "text",
				name: "token",
				message: this.constructor.flags.token.description,
				initial: userConfig.PROCA_TOKEN || "API-",
			});
			flags.token = response.token;
		}
		if (!flags.folder) {
			const response = await prompts({
				type: "text",
				name: "folder",
				message: this.constructor.flags.folder.description,
				initial: userConfig.PROCA_FOLDER,
			});
			flags.folder = response.folder;
		}

		if (!flags.token || !flags.token.startsWith("API-")) {
			return error("Token must start with API-, config file not saved");
		}
		write(file, this.generate(flags));
	}
}
