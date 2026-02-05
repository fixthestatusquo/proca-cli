import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

const SERVICE_NAMES = [
  "MAILJET",
  "SES",
  "STRIPE",
  "TEST_STRIPE",
  "SYSTEM",
  "PREVIEW",
  "WEBHOOK",
  "SUPABASE",
  "SMTP",
].map((d) => d.toLowerCase());

export default class OrgEmail extends Command {
  static description =
    "Set email service and supporter confirmation for an org";

  static args = this.multiid();

  static flags = {
    ...this.flagify({ multiid: true }),
    mailer: Flags.string({
      description: "service to send emails",
      options: SERVICE_NAMES,
      helpValue: SERVICE_NAMES,
      default: "system",
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

  async mutate(flags) {
    flags.from = flags.from || `${flags.org}@proca.app`;

    const Document = gql`
      mutation UpdateOrgProcessing(
        $name: String!
        $emailBackend: ServiceName!
        $emailFrom: String!
        $supporterConfirm: Boolean
        $supporterConfirmTemplate: String
      ) {
        updateOrgProcessing(
          name: $name
          emailBackend: $emailBackend
          emailFrom: $emailFrom
          supporterConfirm: $supporterConfirm
          supporterConfirmTemplate: $supporterConfirmTemplate
        ) {
          id
          name
          processing {
            emailBackend
            emailFrom
            supporterConfirm
            supporterConfirmTemplate
          }
          personalData {
            supporterConfirm
            supporterConfirmTemplate
          }
        }
      }
    `;

    const variables = {
      name: flags.name,
      emailBackend: flags.mailer.toUpperCase(),
      emailFrom: flags.from,
    };

    if (flags["supporter-confirm"] !== undefined) {
      variables.supporterConfirm = flags["supporter-confirm"];
      console.log("supporter-confirm", variables.supporterConfirm);
    }

    if (flags["supporter-confirm-template"]) {
      variables.supporterConfirmTemplate = flags["supporter-confirm-template"];
    }

    const result = await mutation(Document, variables);
    return result.updateOrgProcessing;
  }

  simplify = (d) => ({
    id: d.id,
    name: d.name,
    mailer: d.processing.emailBackend,
    from: d.processing.emailFrom,
    supporterConfirm: d.personalData?.supporterConfirm,
    supporterConfirmTemplate: d.personalData?.supporterConfirmTemplate,
  });

  async run() {
    const { flags } = await this.parse();
    const result = await this.mutate(flags);
    this.output(result);
  }
}
