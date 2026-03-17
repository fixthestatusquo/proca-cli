import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
//import {FragmentSummary,} from "#src/queries/org.mjs";
import { gql, mutation } from "#src/urql.mjs";
import { getOrg } from "./get.mjs";

export default class OrgLogo extends Command {
  static description = "add a logo to the org";

  static examples = ["<%= config.bin %> <%= command.id %> <name of the ngo>"];

  static args = this.multiid();

  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ multiid: false, name: "org", char: "o" }),
    url: Flags.string({
      description: "use that url (and update it)",
    }),
    update: Flags.boolean({
      default: true,
      allowNo: true,
      description: "use that url (and update it)",
    }),
  };

  toProxyUrl = (pic) => {
    const url = new URL(pic);
    if (!url.hostname.endsWith("gstatic.com")) return googleUrl;
    const sub = url.hostname.split(".")[0];
    const domain = new URL(url.searchParams.get("url")).hostname;
    return `https://pic.proca.app/favicon/${sub}/${domain}`;
  };

  fetchLogoUrl = async (domain) => {
    const res = await fetch(
      `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
      { redirect: "manual" }, // don't follow — we want the Location header
    );
    const location = res.headers.get("location");
    if (!location) throw new Error(`No redirect for ${domain}`);
    return this.toProxyUrl(location);
  };
  update = async ({ name, config }) => {
    const input = {};

    input.config = typeof config === "string" ? config : JSON.stringify(config);

    const Document = gql`
      mutation update(
        $orgName: String!
        $input: OrgInput!
      ) {
        updateOrg(
          name: $orgName
          input: $input
        ) {
          id, name, config
        }
      }
    `;

    try {
      console.log({
        orgName: name,
        input,
      });
      const r = await mutation(Document, {
        orgName: name,
        input,
      });
      return { id: r.updateOrg };
    } catch (e) {
      const err = e.graphQLErrors?.[0];

      if (err?.extensions?.code === "permission_denied") {
        this.error(`permission denied to update org ${name}`);
      }
      throw new Error(err?.message ?? "failed to update org");
    }
  };

  table = (r) => {
    super.table(r, null, null);
    if (this.flags.config) {
      r.config.locales = undefined;
      this.prettyJson(r.config);
    }
  };

  async run() {
    const { flags } = await this.parse();
    let logo;
    let org;
    if (flags.url) {
      logo = await this.fetchLogoUrl(flags.url);
    }
    try {
      org = await getOrg(flags);
    } catch (e) {
      this.output({ error: "user not a member of org", org: flags.name, logo });
      return;
    }
    if (!logo) logo = await this.fetchLogoUrl(org.config.url);
    org.config.logo = logo;
    if (flags.update) {
      if (!org.config.url) {
        org.config.url = flags.url;
      }
      const r = this.update({ name: flags.name, config: org.config });
      return this.output(r);
    }
    return this.output({ logo, name: flags.name });
  }
}
