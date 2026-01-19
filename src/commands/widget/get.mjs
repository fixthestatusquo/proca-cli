import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { FragmentSummary } from "#src/queries/widget.mjs";
import { gql, query } from "#src/urql.mjs";

export default class WidgetGet extends Command {
  static description = "view a widget";

  static args = this.multiid();

  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ multiid: true }),
    config: Flags.boolean({
      description: "display the config",
      default: true,
      allowNo: true,
    }),
  };

  fetch = async (params) => {
    const GetWidgetDocument = gql`
      query GetWidget($name: String, $id: Int, $config: Boolean = true) {
        actionPage(name: $name, id: $id) {
          ...Summary
          org {
            name
          }
          campaign {
            name
          }
          thankYouTemplate
          config @include(if: $config)
        }
      }
      ${FragmentSummary}
    `;
    const result = await query(GetWidgetDocument, params);
    return result.actionPage;
  };

  table = (r) => {
    super.table(r, null, null);
    if (this.flags.config) {
      r.config = JSON.parse(r.config);
      this.prettyJson(r.config);
    }
  };

  async run() {
    const { args, flags } = await this.parse();
    const data = await this.fetch(flags);
    return this.output(data);
  }
}
