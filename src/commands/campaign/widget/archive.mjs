import { Flags } from "@oclif/core";
import prompts from "prompts";
import WidgetList from "#src/commands/widget/list.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

export default class CampaignWidgetArchive extends Command {
  static description = "Archive all widgets in the campaign by adding suffix";

  static examples = [
    "<%= config.bin %> <%= command.id %> -c test_2025",
    "<%= config.bin %> <%= command.id %> -c test_2025 --suffix _archive --dry-run",
  ];

  static flags = {
    campaign: Flags.string({
      char: "c",
      description: "widgets of the campaign (coordinator or partner)",
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

  renameWidget = async (widgetId, newName) => {
    const UpdateWidgetDocument = gql`
      mutation UpdateActionPage($id: Int!, $name: String!) {
        updateActionPage(id: $id, input: { name: $name }) {
          id
          name
        }
      }
    `;

    const result = await mutation(UpdateWidgetDocument, {
      id: widgetId,
      name: newName,
    });

    return result.updateActionPage;
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

    const renamePlan = widgets.map((widget) => {
      return {
        id: widget.id,
        oldName: widget.name,
        newName: `${widget.name}${suffix}`,
        locale: widget.locale,
      };
    });

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

    const results = [];
    for (const item of renamePlan) {
      try {
        this.log(`Archiving: ${item.oldName} → ${item.newName}`);
        const result = await this.renameWidget(item.id, item.newName);
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
