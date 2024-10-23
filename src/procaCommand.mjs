import { Command, Flags, ux } from "@oclif/core";
import debug from "debug";
import Table from "easy-table";
import fastcsv from "fast-csv";

import { getFilename as fileConfig, load as loadConfig } from "#src/config.mjs";
import { createClient } from "#src/urql.mjs";

export class ProcaCommand extends Command {
	static enableJsonFlag = true;
	procaConfig = { url: "https://api.proca.app/api" };
	format = "human"; // the default formatting
	flags = {};

	static baseFlags = {
		human: Flags.boolean({
			helpGroup: "OUTPUT", // Optional, groups it under a specific help section if desired
			description: "Format output to be read on screen by a human [default]",
			default: true,
			exclusive: ["csv", "json"],
		}),
		json: Flags.boolean({
			helpGroup: "OUTPUT", // Optional, groups it under a specific help section if desired
			description: "Format output as json",
		}),
		csv: Flags.boolean({
			description: "Format output as csv",
			helpGroup: "OUTPUT", // Optional, groups it under a specific help section if desired
		}),
		simplify: Flags.boolean({
			helpGroup: "OUTPUT",
			description:
				"flatten and filter to output only the most important attributes, mostly relevant for json",
			dependsOn: ["json"],
		}),
	};

	async init() {
		await super.init();
		const { flags } = await this.parse();
		this.flags = flags;
		if (flags.json) this.format = "json";
		if (flags.csv) this.format = "csv";

		this.debug = debug("proca");
		const userConfig = loadConfig(this.config.configDir);
		if (userConfig) {
			this.procaConfig = userConfig;
		} else {
			const file = fileConfig(this.config.configDir);
			this.warn("missing config", file);
		}
		createClient(userConfig);
	}

	async catch(err) {
		// Check if the error was caused by a missing flag or wrong argument format
		if (
			err.message.includes("Unexpected argument") ||
			err.message.includes("flag")
		) {
			// Try to adjust the argument as a flag
			const argv = process.argv;
			console.log(argv);
			if (argv.includes("param")) {
				// Adjusting the argument 'param' to be a flag `-id`
				const paramIndex = argv.indexOf("param");
				argv.splice(paramIndex, 0, "-id"); // Insert the flag `-id` before 'param'
			}

			// Re-run the command with modified arguments
			await this.parse();
		} else {
			throw err;
		}
	}

	simplify = (d) => {
		const r = {};
		for (const [key, value] of Object.entries(d)) {
			if (key === "__typename") continue;
			if (value === null) continue;

			if (typeof value === "string" || typeof value === "number") {
				r[key] = value;
				continue;
			}

			if (typeof value === "object") {
				if (value?.name) r[key] = value.name;
				continue;
			}
		}
		return r;
	};

	tlog(color, ...msg) {
		const coloredMsg = msg.map((d) => ux.colorize(this.config.theme[color], d));
		this.log(...coloredMsg);
	}

	info(...msg) {
		this.tlog("info", msg);
	}

	prettyJson(obj) {
		if (typeof obj === "string") {
			obj = JSON.parse(obj);
		}
		this.log(ux.colorizeJson(obj, { theme: this.config.theme.json }));
	}

	warn(...msg) {
		this.tlog("warn", ...msg);
	}
	error(msg, options = {}) {
		const colouredMessage = ux.colorize(this.config.theme.error, msg);
		super.error(colouredMessage, options);
	}

	async csv(data) {
		return new Promise((resolve, reject) => {
			let d = null;
			if (Array.isArray(data)) {
				d = data.map(this.simplify);
			} else {
				d = [this.simplify(data)];
			}
			const stream = fastcsv
				.write(d, { headers: true })
				.on("finish", () => {
					console.log();
					resolve();
				})
				.on("error", reject);

			stream.pipe(process.stdout);
		});
	}

	table(data, transformRow, print = (table) => table.toString()) {
		if (!transformRow) {
			transformRow = (d, cell) => {
				for (const [key, value] of Object.entries(this.simplify(d))) {
					cell(key, value);
				}
			};
		}
		const theme = this.config.theme;
		Table.prototype.pushDelimeter = function (cols) {
			// hack to change the formatting of the header
			cols = cols || this.columns();
			cols.forEach(function (col) {
				this.cell(
					col,
					undefined,
					Table.leftPadder(ux.colorize(theme.flagSeparator, "-")),
				);
			}, this);
			return this.newRow();
		};
		this.log(Table.print(data, transformRow, print));
	}

	async output(data) {
		if (this.format === "json") {
			if (this.flags.simplify) return data.map(this.simplify);
			return data;
		}
		if (this.format === "csv") {
			return this.csv(data);
		}
		return this.table(data);
	}
}

export default ProcaCommand;
