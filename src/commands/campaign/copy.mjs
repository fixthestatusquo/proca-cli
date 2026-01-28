import { Flags } from "@oclif/core";
import prompts from "prompts";
import CampaignGet from "#src/commands/campaign/get.mjs";
import WidgetList from "#src/commands/widget/list.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class CampaignCopy extends Command {
  static args = this.multiid();

  static description = "Copy campaign with all widgets to a new campaign";

  static examples = [
    "<%= config.bin %> <%= command.id %> test_2025 --to test_2026",
    "<%= config.bin %> <%= command.id %> -n old_campaign --to new_campaign",
    "<%= config.bin %> <%= command.id %> -i 936 --to new_campaign --suffix -backup",
  ];

  static flags = {
    ...this.flagify({ multiid: true }),
    to: Flags.string({
      char: "t",
      required: true,
      description: "new campaign name",
      helpValue: "<campaign name>",
    }),
    org: Flags.string({
      char: "o",
      description:
        "organization for the new campaign (defaults to source campaign org)",
      helpValue: "<org name>",
    }),
    title: Flags.string({
      description:
        "title for the new campaign (defaults to source campaign title)",
      helpValue: "<campaign title>",
    }),
    suffix: Flags.string({
      char: "s",
      description:
        "custom suffix to remove from widget names (e.g., -backup, -old)",
      helpValue: "<suffix>",
    }),
    "dry-run": Flags.boolean({
      description: "preview changes without executing",
      default: false,
    }),
  };

  fetchCampaign = async ({ id, name }) => {
    const campaignGet = new CampaignGet([], this.config);
    return await campaignGet.fetch({ id, name });
  };

  fetchWidgets = async (campaignName) => {
    const widgetList = new WidgetList([], this.config);
    widgetList.flags = { campaign: campaignName, config: true };
    return await widgetList.fetchCampaign(campaignName);
  };

  removeSuffix = (name, customSuffix) => {
    if (customSuffix) {
      // Remove custom suffix if provided
      if (name.endsWith(customSuffix)) {
        return name.substring(0, name.length - customSuffix.length);
      }
      return name;
    }

    // Default: remove -vN pattern (e.g., -v1, -v2)
    return name.replace(/-v\d+$/, "");
  };

  createCampaign = async (params) => {
    const CreateCampaignDocument = gql`
      mutation CreateCampaign(
        $org: String!
        $name: String!
        $title: String!
        $config: Json!
      ) {
        addCampaign(
          input: { name: $name, title: $title, config: $config }
          orgName: $org
        ) {
          id
          name
          title
        }
      }
    `;

    const result = await mutation(CreateCampaignDocument, params);
    return result.addCampaign;
  };

  createWidget = async (params) => {
    const CreateWidgetDocument = gql`
      mutation CreateWidget(
        $campaign: String!
        $org: String!
        $name: String!
        $locale: String!
        $config: Json
      ) {
        addActionPage(
          campaignName: $campaign
          orgName: $org
          input: { name: $name, locale: $locale, config: $config }
        ) {
          id
          name
        }
      }
    `;

    const result = await mutation(CreateWidgetDocument, params);
    return result.addActionPage;
  };

  async run() {
    const { flags } = await this.parse();
    const { id, name, to, org, title, suffix, "dry-run": dryRun } = flags;

    this.log(`Fetching source campaign: ${name || id}`);
    const sourceCampaign = await this.fetchCampaign({ id, name });

    this.log(`Fetching widgets from: ${sourceCampaign.name}`);
    const sourceWidgets = await this.fetchWidgets(sourceCampaign.name);

    if (!sourceWidgets || sourceWidgets.length === 0) {
      this.warn("No widgets found in source campaign");
      return;
    }

    this.log(`Found ${sourceWidgets.length} widgets`);

    const newCampaign = {
      name: to,
      title: title || sourceCampaign.title,
      org: org || sourceCampaign.org.name,
      config: sourceCampaign.config,
    };

    const widgets = sourceWidgets.map((widget) => {
      const newName = this.removeSuffix(widget.name, suffix);

      return {
        oldId: widget.id,
        oldName: widget.name,
        newName,
        locale: widget.locale,
        org: widget.org.name,
        config: widget.config,
      };
    });

    this.log("New Campaign:");
    this.log(`  Name: ${newCampaign.name}`);
    this.log(`  Title: ${newCampaign.title}`);
    this.log(`  Org: ${newCampaign.org}`);

    this.log("\nWidgets:");
    this.table(widgets, (item, cell) => {
      cell("old name", item.oldName);
      cell("new name", item.newName);
      cell("locale", item.locale);
      cell("org", item.org);
      return true;
    });

    if (dryRun) {
      this.log("\n[DRY RUN] No changes made");
      return { campaign: newCampaign, widgets };
    }

    // Confirm before proceeding
    const response = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Create campaign "${to}" with ${widgets.length} widgets?`,
      initial: false,
    });

    if (!response.proceed) {
      this.log("Cancelled");
      return;
    }

    // Create new campaign
    this.log(`\nCreating campaign: ${to}`);
    try {
      const createdCampaign = await this.createCampaign({
        org: newCampaign.org,
        name: newCampaign.name,
        title: newCampaign.title,
        config:
          typeof newCampaign.config === "string"
            ? newCampaign.config
            : JSON.stringify(newCampaign.config),
      });
      this.log(`✓ Campaign created: ${createdCampaign.name}`);
    } catch (error) {
      this.error(`Failed to create campaign: ${error.message}`);
      return;
    }

    // Copy widgets
    this.log("\nCopying widgets...");
    const results = [];
    for (const widget of widgets) {
      try {
        this.log(`  Creating: ${widget.newName}`);
        const created = await this.createWidget({
          campaign: to,
          org: widget.org,
          name: widget.newName,
          locale: widget.locale,
          config: widget.config,
        });
        results.push({
          name: created.name,
          id: created.id,
          status: "success",
        });
      } catch (error) {
        this.error(`  Failed to create ${widget.newName}: ${error.message}`);
        results.push({
          name: widget.newName,
          status: "failed",
          error: error.message,
        });
      }
    }

    this.log(`Campaign created: ${to}`);
    this.log(
      `Widgets created: ${results.filter((r) => r.status === "success").length}/${results.length}`,
    );

    return this.output(results);
  }
}
