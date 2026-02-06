import Command from "#src/procaCommand.mjs";
import { gql, query } from "#src/urql.mjs";

export const getCurrentUser = () => {
  const me = new WhoAmI([]);
  return me.fetch();
};

export default class WhoAmI extends Command {
  static aliases = ["user:whoami", "user:me"];
  static description =
    "fetch the information about the current user (based on the token)";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    ...super.globalFlags,
  };

  fetch = async () => {
    const Document = gql`
query  {
  currentUser {
    apiToken {
      expiresAt
    }
    email
    id
    isAdmin
    jobTitle
    phone
    pictureUrl
    roles {
      role org {name}
    }
  }
}
    `;
    const result = await query(Document);
    return result.currentUser;
    //return result.users.map (d => {d.config = JSON.parse(d.config); return d});
  };

  simplify = (d) => {
    const result = {
      id: d.id,
      email: d.email,
    };
    if (d.apiToken) {
      result.tokenExpire = d.apiToken.expiresAt;
    }
    if (d.isAdmin) {
      result.admin = true;
    }
    const roles = d.roles.reduce((acc, item) => {
      if (!acc[item.role]) {
        acc[item.role] = [];
      }
      acc[item.role].push(item.org.name);
      return acc;
    }, {});
    for (const role in roles) {
      result[role] = roles[role].join(",");
    }
    return result;
  };

  table = (r) => {
    super.table(r, null, null);
  };

  async run() {
    let data = [];

    data = await this.fetch();

    return this.output(data);
  }
}
