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

  static examples = [
    "$ proca org:email --org myorg --mailer mailjet",
    "$ proca org:email -o myorg --mailer system --from campaigns@myorg.org",
    "$ proca org:email --org myorg --supporter-confirm",
    "$ proca org:email --org myorg --no-supporter-confirm",
    "$ proca org:email -o myorg --supporter-confirm-template",
  ];
  static args = this.multiid();

  static flags = {
    ...super.globalFlags,
    org: Flags.string({
      aliases: ["name", "o"],
      description: "organisation running the service",
      required: true,
    }),
    mailer: Flags.string({
      description: "service to send emails",
      options: SERVICE_NAMES,
      helpValue: SERVICE_NAMES,
      required: true,
      default: "MAILJET",
    }),
    from: Flags.string({
      description: "Email address to send from (default: <org>@proca.app)",
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
      name: flags.org,
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
