import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { FragmentSummary } from "#src/queries/widget.mjs";
import { gql, query } from "#src/urql.mjs";

export default class WidgetList extends Command {
	static description = "list all the widgets of an org or campaign";

	static examples = ["<%= config.bin %> <%= command.id %> -o <organisation>"];

	static flags = {
		// flag with no value (-f, --force)
		...super.globalFlags,
		org: Flags.string({
			char: "o",
			exactlyOne: ["campaign", "org"],
			description: "widgets of the organisation (coordinator or partner)",
			helpValue: "<organisation name>",
			//      required: true,
		}),
		campaign: Flags.string({
			char: "c",
			description: "widgets of the campaign (coordinator or partner)",
			helpValue: "<campaign name>",
			//      required: true,
		}),
		config: Flags.boolean({
			description: "get the config",
			default: false,
			allowNo: true,
		}),
	};
	fetchCampaign = async (name) => {
		const Document = gql`
query SearchWidgets($campaign: String!, $withConfig: Boolean!) {
  campaign (name:$campaign) { ...on PrivateCampaign {
    actionPages {
      ...Summary
      config @include(if: $withConfig)
      thankYouTemplate
      thankYouTemplateRef
      ...on PrivateActionPage {
        supporterConfirmTemplate
      }
    }}
  }
${FragmentSummary}
}`;
		const result = await query(Document, {
			campaign: name,
			withConfig: this.flags.config,
		});
		return result.campaign.actionPages;
	};

	fetchOrg = async (name) => {
		const Document = gql`
query SearchWidgets($org: String!, $withConfig: Boolean!) {
  org (name:$org) {
    actionPages {
      ...Summary
      config @include(if: $withConfig)
      thankYouTemplate
      thankYouTemplateRef
      ...on PrivateActionPage {
        supporterConfirmTemplate
      }
    }
  }
${FragmentSummary}
}`;
		const result = await query(Document, {
			org: name,
			withConfig: this.flags.config,
		});
		return result.org.actionPages;
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
		if (flags.org) data = await this.fetchOrg(flags.org);
		if (flags.campaign) data = await this.fetchCampaign(flags.campaign);
		return this.output(data);
	}
}
