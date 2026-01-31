import { Flags } from "@oclif/core";
import prompts from "prompts";
import CampaignGet from "#src/commands/campaign/get.mjs";
import WidgetList from "#src/commands/widget/list.mjs";
import WidgetUpdate from "#src/commands/widget/update.mjs";
import Command from "#src/procaCommand.mjs";

export default class CampaignWidgetArchive extends Command {
  static args = this.multiid(); // Add this!

  static description = "Archive all widgets in the campaign by adding suffix";

  static examples = [
    "<%= config.bin %> <%= command.id %> old_campaign",
    "<%= config.bin %> <%= command.id %> -n old_campaign --suffix _backup",
    "<%= config.bin %> <%= command.id %> old_campaign --dry-run",
  ];

  static flags = {
    ...this.flagify({ multiid: true }),
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
    const { id, name, suffix, "dry-run": dryRun } = flags;

    this.log(`Fetching source campaign: ${name || id}`);
    const campaign = await this.fetchCampaign({ id, name });

    if (!campaign) {
      this.error("Campaign not found");
      return;
    }

    this.log(`Fetching widgets for campaign: ${campaign.name}`);
    const widgets = await this.fetchWidgets(campaign.name);

    if (!widgets || widgets.length === 0) {
      this.warn("No widgets found for this campaign");
      return;
    }

    this.log(`Found ${widgets.length} widgets`);

    const renameList = widgets.map((widget) => ({
      id: widget.id,
      oldName: widget.name,
      newName: `${widget.name}${suffix}`,
      locale: widget.locale,
    }));

    this.log("\nArchive plan:");
    this.table(renameList);

    if (dryRun) {
      this.log("\n[DRY RUN] No changes made");
      return renameList;
    }

    // Confirm before proceeding
    const response = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Archive ${renameList.length} widgets by adding suffix "${suffix}"?`,
      initial: false,
    });

    if (!response.proceed) {
      this.log("Cancelled");
      return;
    }

    const widgetUpdate = new WidgetUpdate([], this.config);
    const results = [];

    for (const item of renameList) {
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
