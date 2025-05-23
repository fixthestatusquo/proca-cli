import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { config as dotenv } from "dotenv";

export const getFilename = (folder, env = "default") =>
	join(folder, `${env}.env`);

export const load = (folder, env = "default") => {
	const file = getFilename(folder, env);
	const config = dotenv({ path: file });
	return {
		token: config.parsed.PROCA_TOKEN,
		url: config.parsed.REACT_APP_API_URL,
		folder: process.env.PROCA_CONFIG_FOLDER,
	};
};

export const get = (file, parsed = false) => {
	try {
		if (parsed) {
			const config = dotenv({ path: file });
			return config.parsed;
		}
		const userConfig = readFileSync(file, "utf8");
		return userConfig;
	} catch (e) {
		if (e.code === "ENOENT") {
			return undefined;
		}
		throw e;
	}
};

export const write = (file, content) => {
	writeFileSync(file, content);
};
