import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class OrgUpdate extends Command {
  static description = "Update organisation settings";

  static examples = [
    "<%= config.bin %> <%= command.id %> myorg --title='My Organisation'",
    "<%= config.bin %> <%= command.id %> myorg --reply-enabled",
    "<%= config.bin %> <%= command.id %> myorg --no-reply-enabled",
    "<%= config.bin %> <%= command.id %> myorg --sender-rewrite",
    "<%= config.bin %> <%= command.id %> myorg --no-sender-rewrite",
    "<%= config.bin %> <%= command.id %> myorg --doi-thank-you",
    "<%= config.bin %> <%= command.id %> myorg --no-doi-thank-you",
    "<%= config.bin %> <%= command.id %> myorg --title='My Org' --no-sender-rewrite --reply-enabled",
  ];

  static args = this.namearg();

  static flags = {
    ...this.flagify({ single: true, name: "organisation", char: "o" }),
    title: Flags.string({
      char: "t",
      description: "title/full name of the org",
      helpValue: "<org full name>",
    }),
    "reply-enabled": Flags.boolean({
      description: "enable reply_to for emails",
      allowNo: true,
    }),
    "sender-rewrite": Flags.boolean({
      description:
        "rewrite sender address using SRS (disable for cleaner confirmation emails)",
      allowNo: true,
    }),
    "doi-thank-you": Flags.boolean({
      description: "only send thank you emails to opt-ins",
      allowNo: true,
    }),
  };

  update = async (name, org) => {
    const Document = gql`
      mutation ($name: String!, $org: OrgInput!) {
        updateOrg(name: $name, input: $org) {
          id
          name
          title
          personalData {
            replyEnabled
            doiThankYou
          }
        }
      }
    `;

    const result = await mutation(Document, { name, org });
    if (!result.updateOrg) {
      console.log(result);
      return result;
    }
    return result.updateOrg;
  };

  simplify = (d) => ({
    id: d.id,
    name: d.name,
    title: d.title,
    replyEnabled: d.personalData?.replyEnabled,
    doiThankYou: d.personalData?.doiThankYou,
  });

  async run() {
    const { flags } = await this.parse();

    const org = {};

    if (flags.title) org.title = flags.title;
    if (flags["reply-enabled"] !== undefined)
      org.replyEnabled = flags["reply-enabled"];
    if (flags["doi-thank-you"] !== undefined)
      org.doiThankYou = flags["doi-thank-you"];

    if (Object.keys(org).length === 0) {
      this.error(
        "Provide at least one field to update (--title, --reply-enabled, --sender-rewrite, --doi-thank-you)",
      );
    }

    const data = await this.update(flags.name, org);
    return this.output(data);
  }
}
