import { Args, Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export default class CounterGet extends Command {
	static description = "counter of supporters";

	static examples = [
		"<%= config.bin %> <%= command.id %> --id <id of the campaign>",
		"<%= config.bin %> <%= command.id %> --name <name of the campaign>",
	];

	static args = this.multiid();
	static flags = {
		// flag with no value (-f, --force)
		...this.flagify({ multiid: true }),
		org: Flags.boolean({
			description: "segment by partner",
			default: false,
		}),
		area: Flags.boolean({
			description: "segment by area",
			default: false,
		}),
		without: Flags.string({
			description: "total to add to the partner's counter",
		}),
		number: Flags.boolean({
			description: "just return the number to add to the partner's counter",
			dependsOn: ["without"],
		}),
	};

	fetchExcluding = async (params) => {
		const GetCounterDocument = gql`
query GetCounter($name: String, $id: Int, $without: String!) {
  campaign(name: $name, id: $id) {
    stats {
      supporterCount
      supporterCountByOthers (orgName: $without) 
    }
  }
}`;

		const result = await query(GetCounterDocument, params);
		return result.campaign.stats;
	};

	fetch = async (params) => {
		const GetCounterDocument = gql`
query GetCounter($name: String, $id: Int, $org: Boolean = false, $area: Boolean = false) {
  campaign(name: $name, id: $id) {
    stats {
      supporterCount
      supporterCountByOrg @include(if: $org) { org { name } count }
      supporterCountByArea @include(if: $area) { area count }
    }
  }
}`;

		const result = await query(GetCounterDocument, params);
		return result.campaign.stats;
	};

	simplify = (d) => {
		const result = { total: d.supporterCount };
		d.supporterCountByOrg
			?.sort((a, b) => b.count - a.count)
			.forEach((org) => {
				result[org.org.name] = org.count;
			});
		d.supporterCountByArea
			?.sort((a, b) => b.count - a.count)
			.forEach((area) => {
				result[area.area] = area.count;
			});
		if (d.supporterCountByOthers) {
			result[`without ${this.flags.without}`] = d.supporterCountByOthers;
		}
		return result;
	};
	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		const { args, flags } = await this.parse();
		if (flags.without) {
			const data = await this.fetchExcluding(flags);
			if (flags.number) return console.log(data.supporterCountByOthers);
			return this.output(data);
		}
		const data = await this.fetch(flags);
		return this.output(data);
	}
}
