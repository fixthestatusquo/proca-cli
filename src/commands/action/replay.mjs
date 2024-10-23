import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export default class ReplayAction extends Command {
	static examples = ["<%= config.bin %> <%= command.id %> %pizza%"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		org: Flags.string({
			char: "o",
			description: "campaigns of the organisation (coordinator or partner)",
			required: true,
			//			exactlyOne: ["org", "title"],
			helpValue: "<organisation name>",
		}),
		/*    queue: Flag.string({
      default: "CUSTOM_ACTION_DELIVER",
options: [
    'CUSTOM_ACTION_CONFIRM',
    'CUSTOM_ACTION_DELIVER',
    'CUSTOM_SUPPORTER_CONFIRM',
    'EMAIL_SUPPORTER',
    'SQS',
    'WEBHOOK'
],
    }),
*/
		campaign: Flags.string({
			char: "c",
			description: "name of the campaign, % for wildchar",
			helpValue: "<campaign title>",
		}),
	};

	mutate = async (org, id, queue) => {
		const Document = gql`
        mutation Requeue($org: String!, $ids: [Int!]!, $queue: Queue!){
            requeueActions(orgName:$org, ids: $ids, queue: $queue) {
                count failed
            }
        }`;
	};

	async run() {
		const { args, flags } = await this.parse();
		let data = [];
		const ids = [];
		data = await this.mutate(flags.org, ids, flags.queue);
		return this.output(data);
	}
}
