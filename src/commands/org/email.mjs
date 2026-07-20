import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export const SERVICE_NAMES = [
  "MAILJET",
  "SES",
  "SYSTEM",
  "PREVIEW",
  "SMTP",
  "BREVO",
  "HUBSPOT",
  "TESTMAIL",
].map((d) => d.toLowerCase());

export default class OrgEmail extends Command {
  static description =
    "Set email service and supporter confirmation for an org";

  static examples = [
    "<%= config.bin %> <%= command.id %> myorg --mailer=ses",
    "<%= config.bin %> <%= command.id %> myorg --mailer=brevo",
    "<%= config.bin %> <%= command.id %> myorg --supporter-confirm --supporter-confirm-template=confirm_v2",
    "<%= config.bin %> <%= command.id %> myorg --no-supporter-confirm",
  ];

  static args = this.namearg();

  static flags = {
    ...this.flagify({ name: true, alias: "o" }),
    mailer: Flags.string({
      description: "service to send emails",
      options: SERVICE_NAMES,
      helpValue: SERVICE_NAMES,
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
    const Document = gql`
      mutation UpdateOrgProcessing(
        $name: String!
        $emailBackend: ServiceName
        $supporterConfirm: Boolean
        $supporterConfirmTemplate: String
      ) {
        updateOrgProcessing(
          name: $name
          emailBackend: $emailBackend
          supporterConfirm: $supporterConfirm
          supporterConfirmTemplate: $supporterConfirmTemplate
        ) {
          id
          name
          processing {
            emailBackend
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
      emailBackend: flags.mailer?.toUpperCase() || undefined,
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
    supporterConfirm: d.personalData?.supporterConfirm,
    supporterConfirmTemplate: d.personalData?.supporterConfirmTemplate,
  });

  async run() {
    const { flags } = await this.parse();
    const result = await this.mutate(flags);
    this.output(result);
  }
}
