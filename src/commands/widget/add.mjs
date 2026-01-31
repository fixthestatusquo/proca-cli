import { Flags } from "@oclif/core";
import CampaignGet from "#src/commands/campaign/get.mjs";
import OrgGet from "#src/commands/org/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class WidgetAdd extends Command {
  static flags = {
    ...super.globalFlags,
    campaign: Flags.string({
      char: "c",
      required: true,
      description: "name of the campaign",
      helpValue: "<campaign name>",
    }),
    org: Flags.string({
      char: "o",
      description: "organisation",
      helpValue: "<en>",
    }),
    lang: Flags.string({
      char: "l",
      default: "en",
      description: "language",
      helpValue: "<en>",
    }),
    name: Flags.string({
      char: "n",
      description: "url slug",
      helpValue: "by default  <campaign>/<org>/<lang>",
    }),
  };

  create = async (flag) => {
    let campaign = null;

    if (!flag.org) {
      const campApi = new CampaignGet([], this.config);
      campaign = await campApi.fetch({ name: flag.campaign });
      if (!campaign) {
        throw new Error(`campaign not found: ${flag.campaign}`);
      }
      flag.org = campaign.org.name;
    }

    // Fetch org config for layout fallback
    const orgApi = new OrgGet([], this.config);
    const org = await orgApi.fetch({
      name: flag.org,
      campaigns: false,
      keys: false,
    });

    const input = {
      name: flag.name ?? `${flag.campaign}/${flag.org}/${flag.lang}`,
      locale: flag.lang,
    };

    if (flag.config) {
      input.config =
        typeof flag.config === "string" ? JSON.parse(flag.config) : flag.config;
    }

    // else if (org?.config?.layout) {
    //   input.config = { layout: org.config.layout };
    // }

    // Optional ActionPage fields
    if (flag.journey) input.journey = flag.journey;
    if (flag.thankYouTemplate) input.thankYouTemplate = flag.thankYouTemplate;
    if (flag.thankYouTemplateRef)
      input.thankYouTemplateRef = flag.thankYouTemplateRef;
    if (flag.live !== undefined) input.live = flag.live;

    const Document = gql`
      mutation addPage(
        $campaignName: String!
        $orgName: String!
        $input: ActionPageInput!
      ) {
        addActionPage(
          campaignName: $campaignName
          orgName: $orgName
          input: $input
        ) {
          id
        }
      }
    `;

    try {
      const r = await mutation(Document, {
        campaignName: flag.campaign,
        orgName: flag.org,
        input,
      });
      return { id: r.addActionPage.id };
    } catch (e) {
      const err = e.graphQLErrors?.[0];

      if (err?.path?.[1] === "name") {
        this.error(`invalid name (already taken?): ${input.name}`);
      }

      if (err?.extensions?.code === "permission_denied") {
        this.error(`permission denied to create widget for org ${flag.org}`);
      }

      throw new Error(err?.message ?? "failed to create widget");
    }
  };

  async run() {
    const { flags } = await this.parse();
    const data = await this.create(flags);
    return this.output(data);
  }
}
