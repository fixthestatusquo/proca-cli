import { Flags } from "@oclif/core";
import prompts from "prompts";
import CampaignGet from "#src/commands/campaign/get.mjs";
import WidgetAdd from "#src/commands/widget/add.mjs";
import WidgetList from "#src/commands/widget/list.mjs";
import Command from "#src/procaCommand.mjs";

export default class CampaignWidgetCopy extends Command {
  static args = this.multiid();

  static description = "Copy widgets from one campaign to another";

  static examples = [
    "<%= config.bin %> <%= command.id %> old_campaign --to new_campaign",
    "<%= config.bin %> <%= command.id %> -n old_campaign --to new_campaign",
    "<%= config.bin %> <%= command.id %> old_campaign --to new_campaign --suffix _archive",
    "<%= config.bin %> <%= command.id %> old_campaign --to new_campaign --dry-run",
  ];

  static flags = {
    ...this.flagify({ multiid: true }),
    to: Flags.string({
      char: "t",
      required: true,
      description: "destination campaign name",
      helpValue: "<campaign name>",
    }),
    suffix: Flags.string({
      char: "s",
      description: "suffix to remove from widget names (e.g., _archive, -v1)",
      helpValue: "<suffix>",
      default: "_archive",
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

  async run() {
    const { flags } = await this.parse();
    const { id, name, to, suffix, "dry-run": dryRun } = flags;

    this.log(`Fetching source campaign: ${name || id}`);
    const sourceCampaign = await this.fetchCampaign({ id, name });

    if (!sourceCampaign) {
      this.error(`Source campaign not found: ${name || id}`);
      return;
    }

    this.log(`Fetching widgets from: ${sourceCampaign.name}`);
    const sourceWidgets = await this.fetchWidgets(sourceCampaign.name);

    if (!sourceWidgets || sourceWidgets.length === 0) {
      this.warn("No widgets found in source campaign");
      return;
    }

    this.log(`Found ${sourceWidgets.length} widgets`);

    const widgets = sourceWidgets.map((widget) => {
      const newName = widget.name.replace(suffix, "");
      return {
        newName,
        lang: widget.locale,
        org: widget.org.name,

        config: widget.config ? JSON.stringify(widget.config) : undefined,

        thankYouTemplate: widget.thankYouTemplateRef ?? widget.thankYouTemplate,
      };
    });

    this.log("\n=== WIDGET COPY PLAN ===");
    this.log(`From: ${sourceCampaign.name}`);
    this.log(`To: ${to}`);
    this.log(`\nWidgets (${widgets.length}):`);
    this.table(widgets);

    if (dryRun) {
      this.log("\n[DRY RUN] No changes made");
      return widgets;
    }

    const response = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Copy ${widgets.length} widgets to campaign "${to}"?`,
      initial: false,
    });

    if (!response.proceed) {
      this.log("Cancelled");
      return;
    }

    this.log("\nCopying widgets...");
    const widgetAdd = new WidgetAdd([], this.config);
    const results = [];

    for (const widget of widgets) {
      try {
        this.log(`  Creating: ${widget.newName}`);
        const created = await widgetAdd.create({
          campaign: to,
          org: widget.org,
          name: widget.newName,
          lang: widget.lang,

          config: widget.config,
          thankYouTemplate: widget.thankYouTemplate,
        });

        results.push({
          name: widget.newName,
          id: created.id,
          status: "success",
        });
      } catch (error) {
        if (error.message.includes("invalid name (already taken?)")) {
          // Just log and continue for existing widgets
          this.log(`  ⚠ Skipped (already exists): ${widget.newName}`);
          results.push({
            name: widget.newName,
            status: "skipped",
            reason: "already exists",
          });
        } else if (
          error.message.includes("User is not a member of organisation")
        ) {
          // Skip widgets where user doesn't have permission
          this.log(
            `  ⚠ Skipped (no permission): ${widget.newName} (org: ${widget.org})`,
          );
          results.push({
            name: widget.newName,
            status: "skipped",
            reason: "no permission",
            org: widget.org,
          });
        } else {
          this.warn(`  Failed to create ${widget.newName}: ${error.message}`);
          results.push({
            name: widget.newName,
            status: "failed",
            error: error.message,
          });
        }
      }
    }

    this.log("\n=== COPY COMPLETE ===");
    const successful = results.filter((r) => r.status === "success").length;
    const skipped = results.filter((r) => r.status === "skipped").length;
    const failed = results.filter((r) => r.status === "failed").length;

    this.log(`Widgets created: ${successful}`);
    if (skipped > 0) this.log(`Widgets skipped: ${skipped}`);
    if (failed > 0) this.warn(`Widgets failed: ${failed}`);

    return this.output(results);
  }
}
