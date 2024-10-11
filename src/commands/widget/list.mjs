import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export default class WidgetList extends Command {
	static args = {
		org: Args.string({ description: "organisation" }),
	};

	static description = "list all the widgets of the org";

	static examples = ["<%= config.bin %> <%= command.id %> -o <organisation>"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		org: Flags.string({
			char: "o",
			description: "widgets of the organisation (coordinator or partner)",
			helpValue: "<organisation name>",
			//      required: true,
		}),
		config: Flags.boolean({
			description: "get the config",
			default: false,
			allowNo: true,
		}),
	};

	fetch = async (name) => {
		const Document = gql`
      query SearchWidgets($org: String!, $withConfig: Boolean!) {
        org (name:$org) {
        actionPages {
      id
      locale
      name
journey
        config @include(if: $withConfig)
      thankYouTemplate
      thankYouTemplateRef
...on PrivateActionPage {
      extraSupporters
      status,
      location
      supporterConfirmTemplate
}
        }
        }
      }
    `;
		const result = await query(Document, {
			org: name,
			withConfig: this.flags.config,
		});
		return result.org.actionPages;
		//return result.widgets.map (d => {d.config = JSON.parse(d.config); return d});
	};

	simplify = (d) => {
		const result = {
			id: d.id,
			name: d.name,
			locale: d.locale,
			status: d.status.toLowerCase(),
			location: d.location?.startsWith("https://widget.proca.app")
				? undefined
				: d.location || undefined,
			//			live: d.live,

			//      thankYouTemplate: d.thankYouTemplate || undefined,
			//      thankYouTemplateRef: d.thankYouTemplateRef || undefined,
			// supporterConfirmTemplate: d.supporterConfirmTemplate || undefined,
		};
		if (d.extraSupporters > 0) {
			result.extra = d.extraSupporters;
		}
		if (d.journey) result.journey = d.journey.join(" → ");

		if (this.flags.config) {
		}
		return result;
	};

	table = (r) => {
		super.table(r, null, (table) => table.sort(["id|des"]).toString());
	};

	async run() {
		const { flags, args } = await this.parse(WidgetList);
		let data = [];
		if (args.org && flags.org) {
			throw new Error(
				`${this.id} EITHER <organisation> OR --org <organisation>`,
			);
		}
		if (args.org) {
			flags.org = args.org;
		}

		if (!flags.org) {
			throw new Error(
				`${this.id} EITHER <organisation> OR --org <organisation>`,
			);
		}

		data = await this.fetch(flags.org);
		return this.output(data);
	}
}
