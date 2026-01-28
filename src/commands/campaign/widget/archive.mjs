import { Flags } from "@oclif/core";
import prompts from "prompts";
import WidgetList from "#src/commands/widget/list.mjs";
import WidgetUpdate from "#src/commands/widget/update.mjs";
import Command from "#src/procaCommand.mjs";

export default class CampaignArchive extends Command {
  static description = "Archive all widgets in the campaign by adding suffix";

  static examples = [
    "<%= config.bin %> <%= command.id %> -c test_2025",
    "<%= config.bin %> <%= command.id %> -c test_2025 --suffix _archive --dry-run",
  ];

  static flags = {
    ...super.globalFlags,
    campaign: Flags.string({
      char: "c",
      description: "name of the campaign",
      helpValue: "<campaign name>",
      required: true,
    }),
    suffix: Flags.string({
      char: "s",
      description: "custom suffix to append (default: _archive)",
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
    const { campaign, suffix, "dry-run": dryRun } = flags;

    this.log(`Fetching widgets for campaign: ${campaign}`);
    const widgets = await this.fetchWidgets(campaign);

    if (!widgets || widgets.length === 0) {
      this.warn("No widgets found for this campaign");
      return;
    }

    this.log(`Found ${widgets.length} widgets`);

    const renamePlan = widgets.map((widget) => ({
      id: widget.id,
      oldName: widget.name,
      newName: `${widget.name}${suffix}`,
      locale: widget.locale,
    }));

    this.log("\nArchive plan:");
    this.table(renamePlan, (item, cell) => {
      cell("id", item.id);
      cell("old name", item.oldName);
      cell("new name", item.newName);
      cell("locale", item.locale);
      return true;
    });

    if (dryRun) {
      this.log("\n[DRY RUN] No changes made");
      return renamePlan;
    }

    // Confirm before proceeding
    const response = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Archive ${renamePlan.length} widgets by adding suffix "${suffix}"?`,
      initial: false,
    });

    if (!response.proceed) {
      this.log("Cancelled");
      return;
    }

    const widgetUpdate = new WidgetUpdate([], this.config);

    const results = [];
    for (const item of renamePlan) {
      try {
        this.log(`Archiving: ${item.oldName} → ${item.newName}`);

        const input = {
          name: item.newName,
          locale: item.locale,
        };

        const result = await widgetUpdate.update(item.id, input);
        results.push({
          id: result.id,
          name: result.name,
          status: "success",
        });
      } catch (error) {
        this.error(`Failed to archive ${item.oldName}: ${error.message}`);
        results.push({
          id: item.id,
          name: item.oldName,
          status: "failed",
          error: error.message,
        });
      }
    }

    this.log("\nArchive complete!");
    return this.output(results);
  }
}
