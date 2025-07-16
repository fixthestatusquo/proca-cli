import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import OrgGet from "#src/commands/org/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";
import { getTwitter } from "#src/util/twitter.mjs";

export default class ActionAdd extends Command {
	static examples = [
		"<%= config.bin %> <%= command.id %> -i <widget_id> --firstname=John --email=john@example.org",
	];

	static args = this.multiid();

	static flags = {
		...this.flagify({ multiid: true }),
		id: Flags.integer({
			char: "i",
			description: "widget's id",
			required: true,
		}),
		testing: Flags.boolean({ default: true }),
		optin: Flags.boolean({ default: false }),
		action_type: Flags.string({
			default: "register",
		}),
		firstname: Flags.string({
			description: "supporter's firstname",
			required: true,
		}),
		email: Flags.string({
			description: "email",
			required: true,
		}),
	};

	create = async (flags) => {
		const values = {
			action: {
				actionType: flags.action_type,
				//    "customFields": "'{\"key\":\"value\"}}",
				/*    "mtt": {
      "body": "body",
      "files": [
        "files"
      ],
      "subject": "subject",
      "targets": [
        "targets"
      ]
    },
*/
				testing: flags.testing,
			},
			actionPageId: flags.id,
			contact: {
				address: {
					country: flags.country,
					locality: flags.locality,
					postcode: flags.postcode,
					region: flags.region,
					street: flags.street,
					//      "streetNumber": "streetNumber"
				},
				email: flags.email,
				firstName: flags.firstname,
				lastName: flags.lastname,
				phone: flags.phone,
			},
			privacy: {
				//    "leadOptIn": true,
				optIn: flags.optin,
			},
			tracking: {
				campaign: flags.utm_campaign,
				content: flags.utm_content,
				location: "proca-cli/action/add",
				medium: flags.utm_medium,
				source: flags.utm_source,
			},
		};

		const query = gql`
 mutation (
  $action: ActionInput!
  $actionPageId: Int!
  $contact: ContactInput!
  $contactRef: ID
  $privacy: ConsentInput!
  $tracking: TrackingInput
) {
  addActionContact(
    action: $action
    actionPageId: $actionPageId
    contact: $contact
    contactRef: $contactRef
    privacy: $privacy
    tracking: $tracking
  ) {
    contactRef
    firstName
  }
}`;

		console.log(values, query);
		const result = await mutation(query, values);

		console.log("result", result);
		return result;
	};

	async run() {
		//const { args, flags } = await this.parse(CampaignAdd);
		const { args, flags } = await this.parse();

		const data = await this.create(flags);
		return this.output(data);
	}
}
