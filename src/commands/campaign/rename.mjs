import { Flags } from "@oclif/core";
import prompts from "prompts";
import Command from "#src/procaCommand.mjs";
import { FragmentSummary } from "#src/queries/widget.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

export default class CampaignRename extends Command {
  static description =
    "Rename all widgets in the campaign by adding version suffix";

  static examples = [
    "<%= config.bin %> <%= command.id %> -c gmofree_demeter_2025",
    "<%= config.bin %> <%= command.id %> -c gmofree_demeter_2025 --suffix -backup",
  ];

  static flags = {
    ...super.globalFlags,
    campaign: Flags.string({
      char: "c",
      required: true,
      description: "name of the campaign",
      helpValue: "<campaign name>",
    }),
    suffix: Flags.string({
      char: "s",
      description:
        "custom suffix to append (default: auto-increment version like -v1, -v2)",
      helpValue: "<suffix>",
    }),
    "remove-suffix": Flags.boolean({
      description: "remove everything after the last dash (including the dash)",
      default: false,
      exclusive: ["suffix"],
    }),
    "dry-run": Flags.boolean({
      description: "preview changes without executing",
      default: false,
    }),
  };

  fetchWidgets = async (campaignName) => {
    const Document = gql`
      query GetCampaignWidgets($campaign: String!) {
        campaign(name: $campaign) {
          ... on PrivateCampaign {
            actionPages {
              ...Summary
            }
          }
        }
      }
      ${FragmentSummary}
    `;

    const result = await query(Document, { campaign: campaignName });
    return result.campaign.actionPages;
  };

  detectVersion = (widgets, baseName) => {
    const versionPattern = new RegExp(
      `^${this.escapeRegex(baseName)}-v(\\d+)$`,
    );

    return widgets.reduce((maxVersion, widget) => {
      const match = widget.name.match(versionPattern);
      if (match) {
        const version = Number.parseInt(match[1], 10);
        return version > maxVersion ? version : maxVersion;
      }
      return maxVersion;
    }, 0);
  };

  escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
      const newName = suffix
        ? `${widget.name}${suffix}`
        : `${widget.name}-v${this.detectVersion(widgets, widget.name) + 1}`;

      return {
        id: widget.id,
        oldName: widget.name,
        newName,
        locale: widget.locale,
      };
    });

    this.log("\nRename plan:");
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
      message: `Rename ${renamePlan.length} widgets?`,
      initial: false,
    });

    if (!response.proceed) {
      this.log("Cancelled");
      return;
    }

    const results = [];
    for (const item of renamePlan) {
      try {
        this.log(`Renaming: ${item.oldName} → ${item.newName}`);
        const result = await this.renameWidget(item.id, item.newName);
        results.push({
          id: result.id,
          name: result.name,
          status: "success",
        });
      } catch (error) {
        this.error(`Failed to rename ${item.oldName}: ${error.message}`);
        results.push({
          id: item.id,
          name: item.oldName,
          status: "failed",
          error: error.message,
        });
      }
    }

    this.log("\nRenaming complete!");
    return this.output(results);
  }
}
