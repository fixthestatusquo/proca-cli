import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

export default class ActionRequeue extends Command {
	static description = "requeue actions";

	static examples = ["<%= config.bin %> <%= command.id %>"];

	static flags = {
		...super.globalFlags,
		org: Flags.string({
			char: "o",
			required: true,
			description: "name of the org",
			helpValue: "<org name>",
		}),
		campaign: Flags.string({
			char: "c",
			description: "name of the campaign, % for wildchar",
			helpValue: "<campaign name>",
		}),
		queue: Flags.string({
			char: "q",
			required: true,
			description: "queue to redeliver to",
			default: "CUSTOM_ACTION_DELIVER",
			options: [
				"CUSTOM_ACTION_CONFIRM",
				"CUSTOM_ACTION_DELIVER",
				"CUSTOM_SUPPORTER_CONFIRM",
				"EMAIL_SUPPORTER",
				"SQS",
				"WEBHOOK",
			],
		}),
		limit: Flags.string({
			description: "how many actions per page",
			default: 1000,
			parse: (input) => Number.parseInt(input, 10),
		}),
		after: Flags.string({
			description: "only actions after a date",
			helpValue: "2025-04-09",
			parse: (input) => new Date(input).toISOString(),
		}),
		today: Flags.boolean({
			description: "only actions today",
			exclusive: ["after"],
			parse: (input) => `${new Date().toISOString().split("T")[0]}T00:00:00Z`,
		}),
		optin: Flags.boolean({
			description: "only export the optin actions",
			default: false,
		}),
		testing: Flags.boolean({
			description: "also export the test actions",
			default: false,
		}),
		doi: Flags.boolean({
			description: "only export the double optin actions",
			default: false,
		}),
	};

	process = async (flags) => {
		let page = 0;
		let actions = 0;
		let requeued = 0;
		let error = 0;
		while (true) {
			const ids = await this.fetch(flags);
			if (ids.length === 0) break;
			const result = await this.requeue(flags.org, flags.queue, ids);
			requeued += result.count;
			error += result.failed;
			flags.start = ids[ids.length - 1] + 1;
			process.stdout.write(`\rrequeued ${requeued}, id> ${flags.start}`);
			page += 1;
			actions += ids.length;
		}
		process.stdout.write("\r\x1b[K");
		return { pages: page, actions, requeued, error };
	};

	fetch = async (flags) => {
		const Document = gql`
      query (
        $after: DateTime
        $campaignId: Int
        $campaignName: String
        $includeTesting: Boolean
        $limit: Int
        $onlyDoubleOptIn: Boolean
        $onlyOptIn: Boolean
        $orgName: String!
        $start: Int
      ) {
        actions (
          after: $after
          campaignId: $campaignId
          campaignName: $campaignName
          includeTesting: $includeTesting
          limit: $limit
          onlyDoubleOptIn: $onlyDoubleOptIn
          onlyOptIn: $onlyOptIn
          orgName: $orgName
          start: $start
        ) {
          actionId
          }
      }
    `;
		const result = await query(Document, {
			after: flags.after,
			campaignName: flags.campaign,
			includeTesting: flags.testing,
			limit: flags.limit,
			onlyDoubleOptIn: flags.doi,
			onlyOptIn: flags.optin,
			orgName: flags.org,
			start: flags.start,
		});
		const ids = [];
		result.actions.forEach((d) => ids.push(d.actionId));
		return ids;
	};

	requeue = async (org, queue, ids) => {
		const Document = gql`
mutation ($ids: [Int!], $org: String!, $queue: Queue!) {
  requeueActions(ids: $ids, orgName: $org, queue: $queue) {
    count
    failed
  }
}`;
		const result = await mutation(Document, {
			org,
			queue,
			ids,
		});
		//return result.users.map (d => {d.config = JSON.parse(d.config); return d});
		return result.requeueActions;
	};

	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		const { args, flags } = await this.parse();
		const data = await this.process(flags);
		this.output(data);
	}
}
