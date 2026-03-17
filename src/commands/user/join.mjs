import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class UserJoinOrg extends Command {
  static description = "let a user join an organisation with a role";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static args = this.multiid();

  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ multiid: false, name: "org", char: "o" }),
    role: Flags.string({
      description: "permission level in that org",
      default: "campaigner",
      options: ["owner", "campaigner", "coordinator", "translator"],
    }),
    user: Flags.string({
      char: "u",
      description: "email, default current user",
      helpValue: "<user email>",
    }),
  };

  join = async (org) => {
    const Document = gql`
mutation ($name: String!) {
  joinOrg(name: $name) {
    org {
      config
      name
      title
    }
    status
  }
}
    `;
    const result = await mutation(Document, {
      name: org,
    });
    //return result.users.map (d => {d.config = JSON.parse(d.config); return d});
    return { ...result.joinOrg.org, status: result.joinOrg.status };
  };

  mutate = async (params) => {
    const Document = gql`
mutation ($org: String!, $user: String!, $role: String = "campaigner") {
  addOrgUser (orgName: $org, input : { email: $user, role: $role }) {
    status
  }
}
    `;
    const result = await mutation(Document, {
      user: params.user,
      org: params.name,
      role: params.role,
    });
    return result.addOrgUser;
  };

  table = (r) => {
    super.table(r, null, null);
  };

  async run() {
    const { flags } = await this.parse();
    let data = undefined;
    if (!flags.user) {
      data = await this.join(flags.name);
    } else {
      data = await this.mutate(flags);
    }
    this.output(data);
  }
}
