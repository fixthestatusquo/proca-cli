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
    "<%= config.bin %> <%= command.id %> myorg --from=hello@example.com",
    "<%= config.bin %> <%= command.id %> myorg --supporter-confirm --supporter-confirm-template=confirm_v2",
    "<%= config.bin %> <%= command.id %> myorg --no-supporter-confirm",
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
    from: Flags.string({
      description: "Email address to send from",
      helpValue: "default <org>@proca.app",
    }),
    "supporter-confirm": Flags.boolean({
      description: "enable/disable action confirmation emails",
      allowNo: true,
    }),
    "supporter-confirm-template": Flags.string({
      description: "add confirmation template",
    }),
  };

  update = async (name, org, emailFrom) => {
    const Document = gql`
      mutation (
        $name: String!
        $org: OrgInput!
        $withEmailFrom: Boolean!
        $emailFrom: String
      ) {
        updateOrg(name: $name, input: $org) {
          id
          name
          title
          personalData {
            replyEnabled
            doiThankYou
            supporterConfirm
            supporterConfirmTemplate
          }
        }
        updateOrgProcessing(name: $name, emailFrom: $emailFrom)
          @include(if: $withEmailFrom) {
          processing {
            emailFrom
          }
        }
      }
    `;

    const result = await mutation(Document, {
      name,
      org,
      withEmailFrom: emailFrom !== undefined,
      emailFrom,
    });
    if (!result.updateOrg) {
      console.log(result);
      return result;
    }
    return {
      ...result.updateOrg,
      emailFrom: result.updateOrgProcessing?.processing.emailFrom,
    };
  };

  simplify = (d) => ({
    id: d.id,
    name: d.name,
    title: d.title,
    replyEnabled: d.personalData?.replyEnabled,
    doiThankYou: d.personalData?.doiThankYou,
    supporterConfirm: d.personalData?.supporterConfirm,
    supporterConfirmTemplate: d.personalData?.supporterConfirmTemplate,
    from: d.emailFrom,
  });

  async run() {
    const { flags } = await this.parse();

    const org = {};

    if (flags.title) org.title = flags.title;
    if (flags["reply-enabled"] !== undefined)
      org.replyEnabled = flags["reply-enabled"];
    if (flags["sender-rewrite"] !== undefined)
      org.senderRewrite = flags["sender-rewrite"];
    if (flags["doi-thank-you"] !== undefined)
      org.doiThankYou = flags["doi-thank-you"];
    if (flags["supporter-confirm"] !== undefined)
      org.supporterConfirm = flags["supporter-confirm"];
    if (flags["supporter-confirm-template"])
      org.supporterConfirmTemplate = flags["supporter-confirm-template"];

    if (Object.keys(org).length === 0 && !flags.from) {
      this.error(
        "Provide at least one field to update (--title, --reply-enabled, --sender-rewrite, --doi-thank-you, --from, --supporter-confirm, --supporter-confirm-template)",
      );
    }

    const data = await this.update(flags.name, org, flags.from || undefined);
    return this.output(data);
  }
}
