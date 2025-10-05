import { createInterface } from "node:readline";
import { Flags } from "@oclif/core";
import WidgetGet from "#src/commands/widget/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class WidgetDelete extends Command {
	static description = "Delete a widget";

	static args = this.multiid();

	static flags = {
		...this.flagify({ multiid: true }),
	};

	delete = async (flags) => {
		const deletePageDocument = gql`
      mutation delete( $name:String!) {
        deleteActionPage(name: $name)
      }
    `;

		const r = await mutation(deletePageDocument, { name: flags.name });
		return { deleted: r.deleteActionPage };
	};

	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		const { flags } = await this.parse(WidgetDelete);
		const wg = new WidgetGet([], this.config);
		const widget = await wg.fetch(flags);
		try {
			const data = await this.delete({ name: widget.name });
			widget.status = data.deleted;
		} catch (e) {
			widget.status = "can't delete widgets with actions";
			this.output(widget);
			this.error("a widget with actions can't be deleted");
		}
		return this.output(widget);
	}
}
