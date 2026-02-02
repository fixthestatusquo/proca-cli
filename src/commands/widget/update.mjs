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
  ];

  static args = {
    id: Args.integer({
      description: "widget ID to update",
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

    if (input.config && typeof input.config !== "string") {
      input = {
        ...input,
        config: JSON.stringify(input.config),
      };
    }

    const r = await mutation(Document, {
      id: widgetId,
      input,
    });

    return r.updateActionPage;
  };

  async run() {
    const { args, flags } = await this.parse();
    const { id } = args;
    const { name, locale, color, "confirm-optin": confirmOptIn } = flags;

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
      input.config = merge(widget.config, {
        component: {
          consent: {
            email: {
              confirmOptIn: true,
            },
          },
        },
      });

      this.log("✓ Setting consent.email.confirmOptIn = true");
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
