import { Args, Flags } from "@oclif/core";
import { merge } from "merge-anything";
import WidgetGet from "#src/commands/widget/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class WidgetUpdate extends Command {
  static description = "Update a widget's properties";

  static examples = [
    "<%= config.bin %> <%= command.id %> 4454 --name new_widget_name",
    "<%= config.bin %> <%= command.id %> 4454 --locale fr",
    "<%= config.bin %> <%= command.id %> 4454 --confirm-optin",
    "<%= config.bin %> <%= command.id %> 4454 --confirm-optin --dry-run",
  ];

  static args = {
    id: Args.integer({
      description: "Widget ID",
      required: true,
    }),
  };

  static flags = {
    ...super.globalFlags,

    name: Flags.string({
      char: "n",
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

    "dry-run": Flags.boolean({
      description: "Show changes without updating the widget",
      default: false,
    }),
  };

  fetchWidget = async (params) => {
    const widgetGet = new WidgetGet([], this.config);
    return widgetGet.fetch(params);
  };

  update = async (widgetId, input) => {
    console.log("Updating widget with input:", input);
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

  async run() {
    const { args, flags } = await this.parse();
    const { id } = args;
    const {
      name,
      locale,
      color,
      "confirm-optin": confirmOptIn,
      "dry-run": dryRun,
    } = flags;

    // Fetch current widget
    this.log(`Fetching widget: ${id}`);
    const widget = await this.fetchWidget({ id });

    if (!widget) {
      this.error("Widget not found");
      return;
    }

    this.log(`Current widget: ${widget.name} (id: ${widget.id})`);

    // Validate name
    if (name) {
      const nameParts = name.split("/");
      if (nameParts.length < 2) {
        this.error(
          "Widget name must follow format: campaign_name/org_name or campaign_name/locale or campaign_name/org_name/locale",
        );
        return;
      }
    }

    const input = {
      name: name ?? widget.name,
      locale: locale ?? widget.locale,
    };

    if (color) {
      this.log(`Color update requested: ${color} (not yet implemented)`);
    }
    if (confirmOptIn) {
      const currentConfig =
        typeof widget.config === "string"
          ? JSON.parse(widget.config)
          : (widget.config ?? {});

      const nextConfig = merge(currentConfig, {
        component: {
          consent: {
            email: {
              confirmOptIn: true,
            },
          },
        },
      });

      input.config = nextConfig;

      this.log("✓ Will set consent.email.confirmOptIn = true");

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
