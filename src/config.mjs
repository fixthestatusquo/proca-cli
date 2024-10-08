import { readFileSync } from "node:fs";
import { join } from "node:path";

export const get = ({ folder, onMissing, env = "default" }) => {
	const file = join(folder, `${env}.env`);
	try {
		const userConfig = readFileSync(file);
		return userConfig;
	} catch (e) {
		if (e.code === "ENOENT" && onMissing) {
			onMissing(file);
			return undefined;
		}
		throw e;
	}
};
