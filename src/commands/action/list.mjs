import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import {
	FragmentOrg,
	FragmentStats,
	FragmentSummary,
} from "#src/queries/campaign.mjs";
import { gql, query } from "#src/urql.mjs";

export default class CampaignList extends Command {
	actionTypes = new Set();

	static args = {
		title: Args.string({ description: "name of the campaign, % for wildchar" }),
	};

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
		campaign: Flags.string({
			char: "c",
			description: "name of the campaign, % for wildchar",
			helpValue: "<campaign title>",
		}),
		limit: Flags.string({
			description: "max number of actions",
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
		utm: Flags.boolean({
			description: "display the utm tracking parameters",
			default: true,
			allowNo: true,
			exclusive: ["simplify"],
		}),
		comment: Flags.boolean({
			description: "display the comment",
			default: true,
			allowNo: true,
			exclusive: ["simplify"],
		}),
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
        exportActions(
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
          actionPage {
            locale
            name
          }
          actionType
          campaign {
            name
          }
          contact {
            contactRef
            payload
            nonce
            publicKey {
              public
            }
          }
          createdAt
          customFields
          privacy {
            emailStatus
            emailStatusChanged
            givenAt
            optIn
            withConsent
          }
          tracking {
            campaign
            content
            medium
            source
          }
        }
      }
    `;
		const result = await query(Document, {
			after: flags.after,
			//  "campaignId": 42,
			campaignName: flags.campaign,
			includeTesting: flags.testing,
			limit: flags.limit,
			onlyDoubleOptIn: flags.doi,
			onlyOptIn: flags.optin,
			orgName: flags.org,
			start: flags.start,
		});
		return result.exportActions.map((d) => {
			d.customFields = JSON.parse(d.customFields);
			if (!d.contact.publicKey) {
				const ref = d.contactRef;
				d.contact = JSON.parse(d.contact.payload);
				d.contact.contactRef = ref;
			} else {
				this.error(
					`encrypted contact we need the private key for ${d.contact.publicKey.public}`,
				);
			}
			return d;
		});
		//		return result.exportActions;
	};

	simplify = (d) => {
		const result = {
			id: d.actionId,
			firstname: d.contact.firstName,
			country: d.contact.country,
			email: d.contact.email,
			type: d.actionType,
			date: d.createdAt,
			campaign: d.campaign.name,
			widget_id: d.actionPage.id,
			widget: d.actionPage.name,
			//            customFields
		};
		if (this.flags.comment && d.customFields?.comment)
			result.comment = d.customFields.comment;
		if (d.customFields?.emailProvider)
			result.provider = d.customFields.emailProvider;
		if (this.flags.utm && d.tracking) {
			result.utm_medium =
				d.tracking.medium === "unknown" ? undefined : d.tracking.medium;
			result.utm_source =
				d.tracking.source === "unknown" ? undefined : d.tracking.source;
			result.utm_campaign =
				d.tracking.campaign === "unknown" ? undefined : d.tracking.campaign;
			if (d.tracking.content)
				result.utm_content =
					d.tracking.content === "unknown" ? undefined : d.tracking.content;
		}
		return result;
	};

	_table = (r) => {
		super.table(r, null, (table) => table.sort(["id|des"]).toString());
	};

	async run() {
		const { args, flags } = await this.parse();
		if (flags.today) flags.after = flags.today;
		let data = [];

		data = await this.fetch(flags);
		return this.output(data);
	}
}
