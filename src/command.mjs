import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Command, Flags, ux } from "@oclif/core";
import debug from "debug";
import Table from "easy-table";

export class ProcaCommand extends Command {
	enableJsonFlag = true;
	procaConfig = { url: "https://api.proca.app/api" };
	format = "table"; // the default formatting

	static baseFlags = {
		json: Flags.boolean({
			helpGroup: "GLOBAL", // Optional, groups it under a specific help section if desired
			description: "Format output as json",
			exclusive: ["csv"],
		}),
		csv: Flags.boolean({
			description: "Format output as csv",
			helpGroup: "GLOBAL", // Optional, groups it under a specific help section if desired
			exclusive: ["json"],
		}),
	};

	async init() {
		await super.init();
		const { flags } = await this.parse();
		if (flags.json) this.format = "json";
		if (flags.csv) this.format = "csv";

		this.debug = debug("proca");
		const file = join(this.config.configDir, "config.env");
		try {
			const userConfig = readFileSync(file);
			this.info("User config:");
			console.dir(userConfig);
			this.procaConfig = userConfig;
		} catch (e) {
			if (e.code === "ENOENT") {
				this.info("missing config", file);
			} else throw e;
		}
	}
	async catch(error, exitCode) {
		this.error(error);
		process.exit(exitCode || 1);
		//    return super.catch(err)
	}
	tlog(color, ...msg) {
		const coloredMsg = msg.map((d) => ux.colorize(this.config.theme[color], d));
		this.log(...coloredMsg);
	}

	info(...msg) {
		this.tlog("info", msg);
	}

	prettyJson(obj) {
		this.log(ux.colorizeJson(obj, { theme: this.config.theme.json }));
	}

	warn(msg) {
		this.tlog("warn", msg);
	}
	error(msg) {
		this.tlog("error", msg);
	}

	table(data, transformRow, print = (table) => table.toString()) {
		this.log(Table.print(data, transformRow, print));
	}

	output(data) {
		if (this.format === "json") {
			return data;
		}
		this.table(data);
	}
}

export default ProcaCommand;
