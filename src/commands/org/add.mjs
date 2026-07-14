import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import { SERVICE_NAMES } from "#src/commands/org/email.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";
import { getTwitter } from "#src/util/twitter.mjs";

export default class OrgAdd extends Command {
  static args = this.namearg();

  static flags = {
    ...this.flagify({ single: true, name: "organisation", char: "o" }),
    title: Flags.string({
      char: "t",
      description: "title/full name of the org",
      helpValue: "<org full name>",
    }),
    email: Flags.string({
      char: "e",
      description: "email address of the org",
      helpValue: "<org email address>",
    }),
    mailer: Flags.string({
      description: "service to send emails",
      options: SERVICE_NAMES,
      helpValue: SERVICE_NAMES,
      default: "system",
    }),
  };

  create = async (_org, emailFrom, emailBackend) => {
    const org = { ..._org, config: JSON.stringify(_org.config) };

    const AddOrgDocument = gql`
      mutation (
        $org: OrgInput!
        $name: String!
        $emailBackend: ServiceName
        $emailFrom: String
      ) {
        addOrg(input: $org) {
          config
          name
          title
        }
        updateOrgProcessing(
          name: $name
          emailBackend: $emailBackend
          emailFrom: $emailFrom
        ) {
          processing {
            emailBackend
            emailFrom
          }
        }
      }
    `;
    const result = await mutation(AddOrgDocument, {
      org,
      name: org.name,
      emailBackend,
      emailFrom,
    });
    if (!result.addOrg) {
      console.log(result);
      return result;
    }
    return {
      ...result.addOrg,
      emailBackend: result.updateOrgProcessing?.processing.emailBackend,
      emailFrom: result.updateOrgProcessing?.processing.emailFrom,
    };
  };

  async run() {
    const { flags } = await this.parse();

    const org = {
      name: flags.name,
      title: flags.title || flags.name,
      config: {},
    };

    const emailFrom = flags.email || `${flags.name}@proca.app`;
    const emailBackend = flags.mailer.toUpperCase();

    const data = await this.create(org, emailFrom, emailBackend);
    return this.output(data);
  }
}
