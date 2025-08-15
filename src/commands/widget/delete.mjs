import { createInterface } from "node:readline";
import { Flags } from "@oclif/core";
import WidgetGet from "#src/commands/widget/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class WidgetDelete extends Command {
	static description = "Delete an action page by ID";

	static examples = [
		"$ proca widget delete -i PAGE_ID",
		"$ proca widget delete --id PAGE_ID",
	];

	static flags = {
		...super.globalFlags,
		id: Flags.integer({
			char: "i",
			required: true,
			description: "ID of the action page to delete",
			helpValue: "<id>",
		}),
	};

	delete = async (flag) => {
		const deletePageDocument = gql`
      mutation delete($id: Int!) {
        deleteActionPage(id: $id)
      }
    `;

		try {
			const r = await mutation(deletePageDocument, { id: flag.id });
			return { deleted: r.deleteActionPage };
		} catch (e) {
			const errors = e.graphQLErrors || [];
			console.error("Error deleting action page:", errors);
			throw e;
		}
	};

	askConfirm = (question) => {
		const rl = createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		return new Promise((resolve) => {
			rl.question(`${question} (y/n): `, (answer) => {
				rl.close();
				resolve(answer.trim().toLowerCase() === "y");
			});
		});
	};

	// !!! should we forbid if user is not member of the org?

	async run() {
		const { flags } = await this.parse(WidgetDelete);
		const wg = new WidgetGet([], this.config);
		const widget = await wg.fetch(flags);
		if (!widget) {
			this.error("No widget found with given ID or name.");
		}

		this.log("Delete widget:");
		this.log(`ID: ${widget.id}`);
		this.log(`Name: ${widget.name}`);
		this.log(`Campaign: ${widget.campaign?.name}`);
		this.log(`Org: ${widget.org?.name}`);

		// ask for confirmation
		const confirm = await this.askConfirm("Type 'y' to confirm");
		if (!confirm) {
			this.log("Aborted.");
			return;
		}

		const data = await this.delete(flags);
		return this.output(data);
	}
}
