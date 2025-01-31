import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class OrgDelete extends Command {
	static examples = [
		"<%= config.bin %> <%= command.id %>  <organisation_name>",
	];
	static args = this.multiid();

	static flags = {
		// flag with no value (-f, --force)
		...this.flagify({ multiid: true }),
		name: Flags.string({
			char: "n",
			description: "name of the org",
			helpValue: "<org name>",
		}),
	};

	delete = async (org) => {
		console.log(org);

		const DeleteOrgDocument = gql`
mutation ($org: String!) {
  deleteOrg(name: $org) 
  
}
    `;
		const result = await mutation(DeleteOrgDocument, {
			org,
		});
		console.log(result);
		if (!result.deleteOrg) {
			console.log(result);
			return result;
		}
		return result?.deleteOrg;
	};

	async run() {
		const { args, flags } = await this.parse();

		const data = await this.delete(flags.name);
		return data;
	}
}
