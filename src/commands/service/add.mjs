import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

const SERVICE_NAMES = [
  "MAILJET",
  "SES",
  "STRIPE",
  "TEST_STRIPE",
  "PREVIEW",
  //	"SYSTEM", not an external service type, just an alias
  "WEBHOOK",
  "SUPABASE",
  "SMTP",
].map((d) => d.toLowerCase());

export default class OrgEmail extends Command {
  static description =
    "Set service, usually email backend for an org, the specific meaning of each param is dependant on the service";

  static flags = {
    ...super.globalFlags,
    org: Flags.string({
      char: "o",
      description: "organisation running the service",
      required: true,
    }),
    type: Flags.string({
      description: "type of the service",
      options: SERVICE_NAMES,
      required: true,
      default: "system",
    }),
    user: Flags.string({
      description: "credential of the account on the service",
    }),
    password: Flags.string({
      description: "credential of the account on the service",
    }),
    host: Flags.string({
      description: "server of the service",
    }),
    path: Flags.string({
      description: "path on the service",
    }),
  };

  async mutate(flags) {
    const Document = gql`
 mutation ($id: Int, $input: ServiceInput!, $orgName: String!) {
  upsertService(id: $id, input: $input, orgName: $orgName) {    host    id    name    path    user  }
}
  `;

    const variables = {
      //      id: flags.id || null
      orgName: flags.org,
      input: {
        name: flags.type.toUpperCase(),
        host: flags.host || "",
        path: flags.path || "",
        user: flags.user || "",
        password: flags.password || "",
      },
    };

    const result = await mutation(Document, variables);
    return result.upsertService;
  }

  table = (r) => super.table(r, null, null);

  async run() {
    const { flags } = await this.parse();
    const result = await this.mutate(flags);
    this.output(result);
  }
}
