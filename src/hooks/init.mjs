import oclif from "@oclif/core";
import { config as dotenv } from "dotenv";
import { getFilename, load } from "#src/config.mjs";
import CustomHelp from "./help.mjs";

const getEnv = () => {
	const rawArgs = process.argv.slice(2);
	let envValue = undefined;
	// Manually check for --environment or -e
	rawArgs.findIndex((arg, envIndex) => {
		if (arg === "--env") {
			// || arg === '-e') {
			envValue = rawArgs[envIndex + 1]; // Next arg is the value
			return true;
		}
		if (arg.startsWith("--env=")) {
			envValue = arg.split("=")[1];
			return true;
		}
	});

	//      console.log(`Environment set to: ${envValue}`);

	return envValue;
};

const hook = async (opts) => {
	const config = load(opts.config.configDir, getEnv());
	if (config) {
		opts.config.procaConfig = config;
	} else {
		const file = getFilename(opts.config.configDir);
		this.warn("missing config", file);
	}

	//console.log(opts);
	//console.log(opts.config.helpClass, CustomHelp);
	//	opts.config.helpClass = CustomHelp;
};

export default hook;
