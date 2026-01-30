import { Flags } from "@oclif/core";
import prompts from "prompts";
import WidgetAdd from "#src/commands/widget/add.mjs";
import WidgetList from "#src/commands/widget/list.mjs";
import Command from "#src/procaCommand.mjs";

export default class CampaignWidgetCopy extends Command {
  static description = "Copy widgets from one campaign to another";

  static examples = [
    "<%= config.bin %> <%= command.id %> --from test_2025 --to test_2026",
    "<%= config.bin %> <%= command.id %> --from old --to new --suffix _archive",
    "<%= config.bin %> <%= command.id %> --from old --to new --dry-run",
  ];

  static flags = {
    ...super.globalFlags,
    from: Flags.string({
      char: "f",
      required: true,
      description: "source campaign name",
      helpValue: "<campaign name>",
    }),
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

  fetchWidgets = async (campaignName) => {
    const widgetList = new WidgetList([], this.config);
    widgetList.flags = { campaign: campaignName, config: true };
    return await widgetList.fetchCampaign(campaignName);
  };

  async run() {
    const { flags } = await this.parse();
    const { from, to, suffix, "dry-run": dryRun } = flags;

    this.log(`Fetching widgets from: ${from}`);
    const sourceWidgets = await this.fetchWidgets(from);

    if (!sourceWidgets || sourceWidgets.length === 0) {
      this.warn("No widgets found in source campaign");
      return;
    }

    this.log(`Found ${sourceWidgets.length} widgets`);

    const widgets = sourceWidgets.map((widget) => {
      const newName = widget.name.replace(suffix, "");

      return {
        oldId: widget.id,
        oldName: widget.name,
        newName,
        locale: widget.locale,
        org: widget.org.name,
        config: widget.config,
      };
    });

    this.log("\n=== WIDGET COPY PLAN ===");
    this.log(`From: ${from}`);
    this.log(`To: ${to}`);
    this.log(`\nWidgets (${widgets.length}):`);
    this.table(widgets, (item, cell) => {
      cell("old name", item.oldName);
      cell("new name", item.newName);
      cell("locale", item.locale);
      cell("org", item.org);
      return true;
    });

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
          lang: widget.locale,
          config: widget.config,
        });

        results.push({
          name: widget.newName,
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

    this.log("\n=== COPY COMPLETE ===");
    this.log(
      `Widgets copied: ${results.filter((r) => r.status === "success").length}/${results.length}`,
    );

    return this.output(results);
  }
}
