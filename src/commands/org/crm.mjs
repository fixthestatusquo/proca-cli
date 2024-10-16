import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
//import {FragmentSummary,} from "#src/queries/org.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

export default class OrgCRM extends Command {
	static description = "view a org crm synchroniser";

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		name: Flags.string({
			char: "n",
			charAliases: ["o"],
			required: true,
			description: "name of the org",
			helpValue: "<org name>",
		}),
		synchronize: Flags.boolean({
			//     default: undefined,
			aliases: ["deliver", "enable"],
			description: "enable or disable the synchronisation queue",
			allowNo: true,
		}),
	};

	fetch = async (params) => {
		const GetOrgDocument = gql`
      query GetOrg($name: String!) {
        org (name: $name) {
          id name title
          processing { customActionDeliver }
        }
      }
    `;
		const result = await query(GetOrgDocument, {
			name: params.name,
		});
		return result.org;
	};

	mutate = async (name, deliver) => {
		const Document = gql`
mutation ($name: String!, $deliver: Boolean!) {
  updateOrgProcessing (name: $name,customActionDeliver: $deliver) {
    id, name, title, processing {customActionDeliver}
  }
}
    `;
		console.log("deliver", deliver);
		const result = await mutation(Document, {
			name: name,
			deliver: deliver,
		});
		console.log("deliver", deliver);
		return result.updateOrgProcessing;
	};

	simplify = (d) => {
		const result = {
			id: d.id,
			name: d.name,
			title: d.title,
			deliver: d.processing.customActionDeliver,
			queue: d.processing.customActionDeliver
				? `cus.${d.id}.deliver`
				: "call with --synchronize to enable",
		};
		return result;
	};

	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		const { args, flags } = await this.parse();
		if (typeof flags.synchronize === "boolean") {
			const data = await this.mutate(flags.name, flags.synchronize);
			return this.output(data);
		}
		const data = await this.fetch(flags);
		if (!data.processing.customActionDeliver)
			this.info("actions aren't delivered, call with --synchronize to enable");
		return this.output(data);
	}
}
