import oclif from "@oclif/core";
import { config as dotenv } from "dotenv";
import { getFilename, load } from "#src/config.mjs";
import CustomHelp from "./help.mjs";

const hook = async (opts) => {
	const config = load(opts.config.configDir);
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
