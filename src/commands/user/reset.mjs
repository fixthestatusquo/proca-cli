import { Args, Flags } from "@oclif/core";
import { error, stdout } from "@oclif/core/ux";
import prompts from "prompts";
import { format, get as getConfig, getFilename, write } from "#src/config.mjs";
import Command from "#src/procaCommand.mjs";

export default class UserReset extends Command {
	static description = "Reset user API token";

	static args = {
		user: Args.string({ description: "Username (email)" }),
	};

	static flags = {
		...super.globalFlags,
		password: Flags.string({ description: "Password" }),
		url: Flags.string({ description: "URL of the Proca server API" }),
	};

	async run() {
		const { args, flags } = await this.parse(UserReset);

		const file = getFilename(this.config.configDir, flags.env);
		const userConfig = getConfig(file, true) || {};

		if (!args.user) {
			const response = await prompts({
				type: "text",
				name: "user",
				message: "Username:",
			});
			args.user = response.user;
		}

		if (!flags.password) {
			const response = await prompts({
				type: "password",
				name: "password",
				message: "Password:",
			});
			flags.password = response.password;
		}

		const url =
			flags.url || userConfig.REACT_APP_API_URL || "https://api.proca.app/api";

		if (!args.user || !flags.password) {
			return error("User and password are required.");
		}

		const query = `mutation {
            resetApiToken
        }`;

		const auth = `Basic ${Buffer.from(`${args.user}:${flags.password}`).toString("base64")}`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: auth,
				},
				body: JSON.stringify({ query }),
			});

			const data = await response.json();

			if (data.errors) {
				return error(data.errors.map((e) => e.message).join("\n"));
			}

			const newToken = data.data.resetApiToken;
			this.log(`New API token: ${newToken}`);

			userConfig.PROCA_TOKEN = newToken;
			write(file, format(userConfig));
			this.log(`Token saved to ${file}`);
		} catch (e) {
			error(e.message);
		}
	}
}
