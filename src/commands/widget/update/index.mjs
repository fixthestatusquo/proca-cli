import { Args, Flags } from "@oclif/core";
import { merge } from "merge-anything";
import { getWidget } from "#src/commands/widget/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class WidgetUpdate extends Command {
  static description = "Update a widget's properties";
  static examples = [
    "<%= config.bin %> <%= command.id %> -name campaign/widget --locale fr",
    "<%= config.bin %> <%= command.id %> 42 --confirm-optin",
    "<%= config.bin %> <%= command.id %> --dxid=pnc -confirm-optin --dry-run",
  ];

  static args = this.multiid();

  // @ivana, let's make separate update xxx than inherit, check external
  static flags = {
    ...this.flagify({ multiid: true }),
    rename: Flags.string({
      hidden: true, // use proca widget update name instead
      description: "new name for the widget",
      helpValue: "<widget name>",
    }),

    locale: Flags.string({
      char: "l",
      description: "change the locale",
      helpValue: "<locale>",
    }),
    color: Flags.string({
      description: "update color (not yet implemented)",
      helpValue: "<hex code>",
    }),
    "confirm-optin": Flags.boolean({
      description:
        "add confirmOptIn (check email snack) to consent.email component ",

      default: false,
    }),
    "confirm-action": Flags.boolean({
      description:
        "add actionConfirm (check email snack) to consent.email component ",

      default: false,
    }),

    "dry-run": Flags.boolean({
      description: "Show changes without updating the widget",
      default: false,
    }),
  };

  update = async (widgetId, input) => {
    const Document = gql`
      mutation UpdateActionPage($id: Int!, $input: ActionPageInput!) {
        updateActionPage(id: $id, input: $input) {
          id
          name
          locale
          config
          thankYouTemplate
        }
      }
    `;

    const payload = {
      ...input,
      ...(input.config && typeof input.config !== "string"
        ? { config: JSON.stringify(input.config) }
        : {}),
    };

    const r = await mutation(Document, {
      id: widgetId,
      input: payload,
    });

    return r.updateActionPage;
  };

  table = (r) => {
    super.table(r, null, null);
    if (this.flags.config) {
      this.prettyJson(r.config);
    }
  };

  async run() {
    const { flags } = await this.parse();
    const {
      id,
      name,
      rename,
      locale,
      color,
      "confirm-optin": confirmOptIn,
      "confirm-action": confirmAction,
      "dry-run": dryRun,
    } = flags;

    // Fetch current widget
    const widget = await getWidget({ id, name });

    if (!widget) {
      this.error("Widget not found");
    }

    // Validate name
    if (rename) {
      const nameParts = rename.split("/");
      if (nameParts.length < 2) {
        this.error(
          "Widget name must follow format: campaign_name/org_name or campaign_name/locale or campaign_name/org_name/locale",
        );
      }
    }

    const input = {
      name: rename ?? rename,
      locale: locale ?? locale,
    };

    if (color) {
      this.error(`Color update requested: ${color} (not yet implemented)`);
    }
    if (confirmOptIn || confirmAction) {
      const act = confirmOptIn ? "confirmOptIn" : "confirmAction";
      const currentConfig =
        typeof widget.config === "string"
          ? JSON.parse(widget.config)
          : (widget.config ?? {});

      const nextConfig = merge(currentConfig, {
        component: {
          consent: {
            email: {
              [act]: true,
            },
          },
        },
      });

      input.config = nextConfig;

      this.log(`✓ Will set consent.email.${act} = true`);

      if (dryRun) {
        this.log("\n--- DRY RUN ---\n");
        this.log("FROM:");
        this.log(JSON.stringify(currentConfig, null, 2));
        this.log("\nTO:");
        this.log(JSON.stringify(nextConfig, null, 2));
        this.log("\n(no mutation executed)");
        return;
      }
    }

    try {
      const updated = await this.update(widget.id, input);
      this.log("✓ Widget updated successfully");
      return this.output(updated);
    } catch (err) {
      this.error(`Failed to update widget: ${err.message}`);
    }
  }
}
