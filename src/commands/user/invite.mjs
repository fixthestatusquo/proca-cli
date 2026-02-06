import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class UserInviteOrg extends Command {
  static description = "invite a user to join an organisation with a role";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    ...super.globalFlags,
    role: Flags.string({
      description: "permission level in that org",
      default: "campaigner",
      options: ["owner", "campaigner", "coordinator", "translator"],
    }),
    org: Flags.string({
      char: "o",
      required: true,
      description: "name of the org",
      helpValue: "<org name>",
    }),
    user: Flags.string({
      char: "u",
      required: true,
      description: "email",
      helpValue: "<user email>",
    }),
  };

  invite = async (params) => {
    const Document = gql`
mutation ($user: String!, $role: String!, $org: String!, $message: String) {
  inviteOrgUser(orgName: $org,  message: $message, input: { email: $user, role: $role}) {
      objectId
      code
  }
}
    `;
    const result = await mutation(Document, params);
    //return result.users.map (d => {d.config = JSON.parse(d.config); return d});
    console.log(result);
    return result.inviteOrgUser;
  };

  table = (r) => {
    super.table(r, null, null);
  };

  async run() {
    const { args, flags } = await this.parse();
    const data = await this.invite(flags);
    this.output(data);
  }
}
