import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export const SERVICE_NAMES = [
  "BREVO",
  "MAILJET",
  "SES",
  "PREVIEW",
  "STRIPE",
  "TEST_STRIPE",
  //	"SYSTEM", not an external service type, just an alias
  "WEBHOOK",
  "SUPABASE",
  "SMTP",
].map((d) => d.toLowerCase());

const EMAIL_CREDENTIAL_TYPES = ["brevo", "mailjet", "ses", "smtp"];

export default class ServiceAdd extends Command {
  static description =
    "Set service, usually email backend for an org. the specific meaning of each param is dependant on the service. \nIf a service from that type exists, it will replace it";

  // examples to add to help
  // <%= config.bin %> resolves to the executable name
  // <%= command.id %> resolves to the command name
  static examples = [
    // Examples can be simple strings
    "<%= config.bin %> <%= command.id %> -o example_org --type system",
    '<%= config.bin %> <%= command.id %> -o example_org --host=tls://mail.example.org:587 --user=login --password "secret" --type smtp',
    '<%= config.bin %> <%= command.id %> -o example_org --host=ssl://mail.example.org:465 --user=login --password "secret" --type smtp',
    '<%= config.bin %> <%= command.id %> -o example_org --type brevo --user login --password "secret" --transactional',
  ];

  static flags = {
    ...this.flagify({
      single: true,
      name: "organisation",
      char: "o",
      required: true,
    }),
    type: Flags.string({
      description: "type of the service",
      options: SERVICE_NAMES,
      required: true,
    }),
    user: Flags.string({
      description: "credential of the account on the service",
    }),
    password: Flags.string({
      description: "credential of the account on the service",
    }),
    host: Flags.url({
      description: "server of the service",
    }),
    path: Flags.string({
      description: "path on the service",
    }),
    "sending-from": Flags.string({
      description:
        "verified sending address for this backend, used as envelope From domain when rewriting sender (SRS)",
      helpValue: "sender@example.com",
    }),
    transactional: Flags.boolean({
      description:
        "also set this service as the org's backend for transactional (non-MTT) emails",
      default: false,
    }),
  };

  async mutate(flags) {
    if (
      EMAIL_CREDENTIAL_TYPES.includes(flags.type) &&
      (!flags.user || !flags.password)
    ) {
      this.error(`--user and --password are required for --type=${flags.type}`);
    }

    const Document = gql`
      mutation (
        $id: Int
        $input: ServiceInput!
        $orgName: String!
        $transactionalEmailBackend: ServiceName
      ) {
        upsertService(id: $id, input: $input, orgName: $orgName) {
          host
          id
          name
          path
          user
          sendingFrom
        }
        updateOrgProcessing(
          name: $orgName
          transactionalEmailBackend: $transactionalEmailBackend
        ) {
          processing {
            transactionalEmailBackend
          }
        }
      }
    `;

    const variables = {
      orgName: flags.name,
      input: {
        name: flags.type.toUpperCase(),
        host: flags.host || "",
        path: flags.path || "",
        user: flags.user || "",
        password: flags.password || "",
        sendingFrom: flags["sending-from"] || "",
      },
      transactionalEmailBackend: flags.transactional
        ? flags.type.toUpperCase()
        : undefined,
    };

    const result = await mutation(Document, variables);
    return {
      ...result.upsertService,
      transactionalEmailBackend:
        result.updateOrgProcessing.processing.transactionalEmailBackend,
    };
  }

  table = (r) => super.table(r, null, null);

  async run() {
    const { flags } = await this.parse();
    const result = await this.mutate(flags);
    this.output(result);
  }
}
