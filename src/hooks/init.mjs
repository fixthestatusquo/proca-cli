import oclif from "@oclif/core";
import CustomHelp from "../commands/help.mjs";

console.log("hook init");

const hook = async (opts) => {
	opts.config.helpClass = CustomHelp;
};

export default hook;
