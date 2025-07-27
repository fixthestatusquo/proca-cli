import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import OrgGet from "#src/commands/org/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";
import { getTwitter } from "#src/util/twitter.mjs";

export default class CampaignClose extends Command {
	static args = this.multiid();

	static examples = [
		"<%= config.bin %> <%= command.id %> -name <campaign>",
		"<%= config.bin %> <%= command.id %> -i <campaign_id>",
	];

	static flags = {
		...this.flagify({ multiid: true }),
		status: Flags.string({
			description: "status",
			required: true,
			options: ["draft", "live", "closed", "ignored"],
			default: "closed",
		}),
	};

	updateStatus = async (props) => {
		const Query = gql`
mutation (
$id: Int,
$name: String
$status: String!
) {
  updateCampaign (id:$id, input: { name: $name,status: $status }) {
    name
    org {name}
    status
    title
  }
}
    `;

		const result = await mutation(Query, {
			//			org: props.org,
			id: props.id,
			name: props.name,
			status: props.status.toUpperCase(),
		});

		console.log("result", result);
		return result.updateCampaign;
	};

	async run() {
		const { args, flags } = await this.parse();

		const data = await this.updateStatus(flags);
		return this.output(data);
	}
}
