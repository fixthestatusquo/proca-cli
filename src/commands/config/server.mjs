import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { FragmentSummary } from "#src/queries/widget.mjs";
import { gql, query } from "#src/urql.mjs";

export default class ConfigServer extends Command {
	static description = "get the server config";

	fetch = async () => {
		const Document = gql`
query {
  application {
    logLevel
    name
    version
  }
}`;
		const result = await query(Document, {});
		return result.application;
	};

	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		//		const { args, flags } = await this.parse();
		const data = await this.fetch();
		data.url = this.procaConfig.url;
		return this.output(data);
	}
}
