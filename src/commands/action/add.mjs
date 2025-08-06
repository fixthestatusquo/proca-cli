import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import OrgGet from "#src/commands/org/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";
import { getTwitter } from "#src/util/twitter.mjs";

export default class ActionAdd extends Command {
	static examples = [
		"<%= config.bin %> <%= command.id %> -i <widget_id> --firstname=John --email=john@example.org",
		"<%= config.bin %> <%= command.id %> -i <widget_id> --firstname=John --email=john@example.org --country=FR custom1=A custom2=B",
		"<%= config.bin %> <%= command.id %> -i <widget_id> --firstname=John --email=john@example.org target=715a9580-cfe6-4005-9e23-61a62ddecfea --subject='MTT subject' --body='message MTT'",
	];

	static args = this.multiid();
	static strict = false; //THIS DOES NOT WORK

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
		lastname: Flags.string(),
		street: Flags.string(),
		locality: Flags.string(),
		region: Flags.string(),
		country: Flags.string({
			description: "2-letter country iso code",
			parse: async (input) => {
				if (input && !/^[A-Za-z]{2}$/.test(input)) {
					throw new Error("Country code must be exactly 2 letters");
				}
				return input?.toUpperCase(); // optional: normalize to uppercase
			},
		}),
		utm: Flags.string({
			description: "utm=campaign.source.medium",
		}),
		email: Flags.string({
			description: "email",
			required: true,
		}),
		target: Flags.string({ description: "[mtt] uid of the target" }),
		subject: Flags.string({ description: "[mtt] subject of the email" }),
		body: Flags.string({ description: "[mtt] body of the email" }),
	};

	create = async (flags) => {
		const values = {
			action: {
				actionType: flags.action_type,
				customFields: flags.customFields,
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
				...flags.tracking,
				location: "proca-cli/action/add",
			},
		};

		if (flags.target) {
			values.action.mtt = {
				targets: [flags.target],
				subject: flags.subject || "Test MTT",
				body: flags.body || "Please ignore, this is a test",
			};
			values.action.actionType = "mail2target";
		}
		console.log(values.action.mtt);

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

		const result = await mutation(query, values);

		console.log("result", result);
		return result;
	};

	parseUnknownFlags = (argv) => {
		const knownFlags = Object.entries(ActionAdd.flags).flatMap(([key, def]) => {
			const chars = def.char ? [def.char] : [];
			return [key, ...chars];
		});
		/* doesn't work static=false has no effect    const unknownFlags = Object.fromEntries(
      argv
        .filter(arg =>
          (/^--?\w+=/.test(arg)) // --key=val or -x=val
        )
        .map(arg => {
          const keyval = arg.replace(/^-+/, '').split('=')
          return [keyval[0], keyval[1]]
        })
        .filter(([key]) => !knownFlags.includes(key))
    )
*/

		// Extract key=val style positional args (e.g. foo=bar)
		const kvArgs = Object.fromEntries(
			argv
				.filter((arg) => !arg.startsWith("-") && arg.includes("="))
				.map((arg) => arg.split("=")),
		);

		if (!Object.keys(kvArgs).length) return undefined;

		return kvArgs;
	};
	async run() {
		const { args, flags } = await this.parse(ActionAdd, {
			context: { strict: false /* this does not work*/ },
		});

		const customFields = this.parseUnknownFlags(this.argv);
		if (customFields) flags.customFields = JSON.stringify(customFields);
		if (flags.utm) {
			const [campaign, source, medium] = flags.utm.split(".");
			flags.tracking = { source, medium, campaign };
		} else flags.tracking = {};
		const data = await this.create(flags);
		return this.output(data);
	}
}
