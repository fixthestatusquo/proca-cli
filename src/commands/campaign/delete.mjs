import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import {
	FragmentOrg,
	FragmentStats,
	FragmentSummary,
} from "#src/queries/campaign.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class CampaignDelete extends Command {
	actionTypes = new Set();

	static args = {};

	static description = "delete a campaign";

	static examples = ["<%= config.bin %> <%= command.id %> -i 42"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		id: Flags.string({
			char: "i",
			parse: (input) => {
				return Number.parseInt(input, 10);
			},
			description: "id of the campaign",
			exactlyOne: ["id", "name"],
			helpValue: "<organisation name>",
		}),
		name: Flags.string({
			char: "n",
			description: "name of the campaign",
			helpValue: "<campaign name>",
		}),
	};

	mutate = async ({ id, name }) => {
		const Document = gql`
mutation ($id: Int, $name: String) {
  deleteCampaign(id: $id, name: $name)
}`;
		const result = await mutation(Document, {
			id: id,
			name: name,
		});
		return result.deleteCampaign;
	};

	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		const { args, flags } = await this.parse();

		const data = await this.mutate({ id: flags.id, name: flags.name });
		return this.output(data);
	}
}
