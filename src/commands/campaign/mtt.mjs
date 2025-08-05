import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { FragmentMtt } from "#src/queries/campaign.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class CampaignMtt extends Command {
	static args = this.multiid();

	static description = "set the mail to target (mtt) params";

	static examples = [
		"<%= config.bin %> <%= command.id %> -n <test-mtt-campaign>",
	];

	static flags = {
		...this.flagify({ multiid: true }),
		from: Flags.string({
			description: "start date (yyyy-mm-dd)",
			required: true,
		}),
		to: Flags.string({
			description: "end date (yyyy-mm-dd)",
			required: true,
		}),
		template: Flags.string({
			description: "mtt template to use",
		}),
		period: Flags.string({
			description: "period of the day (HH:HH-HH:HH)",
			default: "09:09-18:18",
		}),
		email: Flags.string({
			description: "test email address",
		}),
	};

	updateMtt = async (flags) => {
		const Query = gql`
mutation (
$id: Int,
$name: String
$mtt: CampaignMttInput!
) {
  updateCampaign (id:$id, name: $name, input: { mtt: $mtt }) {
    id, name
          ...Mtt
  }
      ${FragmentMtt}
}
    `;
		const testEmail = flags.email || `campaign+${flags.name}@proca.app`;

		const [startPeriod, endPeriod] = flags.period.split("-");
		const [startHour, startMinute] = startPeriod.split(":");
		const [endHour, endMinute] = endPeriod.split(":");

		const startAt = new Date(flags.from);
		startAt.setHours(startHour, startMinute, 0, 0);

		const endAt = new Date(flags.to);
		endAt.setHours(endHour, endMinute, 0, 0);

		const result = await mutation(Query, {
			//			org: props.org,
			id: flags.id,
			name: flags.name,
			mtt: {
				startAt: startAt.toISOString(),
				endAt: endAt.toISOString(),
				messageTemplate: flags.template,
				testEmail: testEmail,
			},
		});

		return result.updateCampaign;
	};

	simplify = (d) => {
		const result = {
			id: d.id,
			Name: d.name,
		};
		const hhmm = (date) =>
			new Date(date).toLocaleTimeString(undefined, {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			});
		result.from = d.mtt.startAt.substring(0, 10);
		result.to = d.mtt.endAt.substring(0, 10);
		result.period = `${hhmm(d.mtt.startAt)}↔${hhmm(d.mtt.endAt)}`;
		result["test email"] = d.mtt.testEmail;
		result["mtt template"] = d.mtt.template;
		return result;
	};

	table = (r) => {
		super.table(r, null, null);
	};

	async run() {
		const { args, flags } = await this.parse();

		const result = await this.updateMtt(flags);
		this.output(result);
	}
}
