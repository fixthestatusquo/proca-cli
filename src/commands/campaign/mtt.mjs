import { Flags } from "@oclif/core";
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
      required: false,
    }),
    to: Flags.string({
      description: "end date (yyyy-mm-dd)",
      required: false,
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
    cc: Flags.string({
      description: "comma-separated list of CC email addresses",
    }),
    sender: Flags.boolean({
      description: "add sender to CC",
      default: false,
    }),
    drip: Flags.boolean({
      description: "drip delivery or deliver as fast as possible",
      default: false,
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

    const mtt = {
      testEmail,
    };

    if (flags.template) mtt.messageTemplate = flags.template;
    if (flags.email) mtt.testEmail = testEmail;
    if (flags.cc) mtt.ccContacts = flags.cc.split(",").map((e) => e.trim());
    if (flags.sender) mtt.ccSender = flags.sender;

    if (flags.from) {
      const startAt = new Date(flags.from);
      startAt.setHours(startHour, startMinute, 0, 0);
      mtt.startAt = startAt.toISOString();
    }

    if (flags.to) {
      const endAt = new Date(flags.to);
      endAt.setHours(endHour, endMinute, 0, 0);
      mtt.endAt = endAt.toISOString();
    }

    const result = await mutation(Query, {
      id: flags.id,
      name: flags.name,
      mtt,
    });
    return result.updateCampaign;
  };

  simplify = (d) => {
    const result = { id: d.id, Name: d.name };
    const hhmm = (date) =>
      new Date(date).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    if (d.mtt.startAt && d.mtt.endAt) {
      result.from = d.mtt.startAt.substring(0, 10);
      result.to = d.mtt.endAt.substring(0, 10);
      result.period = `${hhmm(d.mtt.startAt)}↔${hhmm(d.mtt.endAt)}`;
    }
    result["test email"] = d.mtt.testEmail;
    result["mtt template"] = d.mtt.messageTemplate;
    if (d.mtt.ccContacts?.length)
      result["cc contacts"] = d.mtt.ccContacts.join(", ");
    if (typeof d.mtt.ccSender !== "undefined") {
      result["cc sender"] = d.mtt.ccSender ? "yes" : "no";
    }

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
