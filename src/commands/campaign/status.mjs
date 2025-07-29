import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class CampaignStatus extends Command {
	static args = this.multiid();
	static aliases = ["campaign:close"];

	static examples = [
		"<%= config.bin %> <%= command.id %> -name <campaign>",
		"<%= config.bin %> <%= command.id %> -i <campaign_id>",
	];

	static isCloseCommand =
		process.argv.includes("close") ||
		this.commandPath?.includes("close") ||
		this.id?.includes("close");

	static flags = {
		status: Flags.string({
			...this.flagify({ multiid: true }),
			description: "Status to set",
			required: true,
			default: this.isCloseCommand ? "close" : undefined,
			options: ["draft", "live", "closed", "ignored"],
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
