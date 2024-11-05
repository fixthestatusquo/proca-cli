import { Args, Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export default class CounterGet extends Command {
	ignored = ["share_confirmed"];
	secondary = ["share"];

	static description = "counter of actions";

	static examples = [
		"<%= config.bin %> <%= command.id %> --id <id of the campaign>",
		"<%= config.bin %> <%= command.id %> --name <name of the campaign>",
	];

	static args = this.multiid();
	static flags = {
		// flag with no value (-f, --force)
		...this.flagify({ multiid: true }),
	};

	fetch = async (params) => {
		const GetCounterDocument = gql`
      query GetCounter($name: String, $id: Int) {
        campaign(name: $name, id: $id) {
          stats {
            actionCount {actionType, count}
          }
        }
      }
    `;
		const result = await query(GetCounterDocument, params);
		return result.campaign.stats;
	};

	simplify = (d) => {
		const result = { sharer: undefined };
		let primary = 0;
		let secondary = 0;
		d.actionCount.forEach((type) => {
			if (this.ignored.includes(type.actionType)) return;
			if (this.secondary.includes(type.actionType)) {
				secondary += type.count;
			} else {
				primary += type.count;
			}
			result[type.actionType] = type.count;
		});
		if (primary) result.sharer = `${Math.round((100 * secondary) / primary)}%`;
		return result;
	};
	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		const { args, flags } = await this.parse();
		const data = await this.fetch(flags);
		return this.output(data);
	}
}
