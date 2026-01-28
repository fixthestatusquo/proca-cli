import { Flags } from "@oclif/core";
import { mergeAndConcat as merge } from "merge-anything";
import WidgetGet from "#src/commands/widget/get.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class WidgetRebuild extends Command {
  static description = "(re)build a widget or all the widgets of a campaign";

  static examples = [
    "$ proca-cli widget rebuild 42",
    "$ proca-cli widget rebuild climate-action/my-org/en",
  ];

  static args = this.multiid();

  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ multiid: true }),
  };

  rebuild = async ({ widget, timestamp = new Date().toISOString() }) => {
    //
    const data = merge(widget, { config: { layout: { update: timestamp } } });

    const PushWidgetDocument = gql`
mutation updateActionPage($id: Int!, $config: Json!) {
  updateActionPage(id: $id, input: {config:$config}) {
    id, name, locale, config
    ...on PrivateActionPage {
      status
      location
      org {name}
    }
  }
}
    `;
    const r = await mutation(PushWidgetDocument, {
      id: data.id,
      config: JSON.stringify(data.config),
    });
    if (r.errors) {
      console.log(r);
      console.log("check your config $npx proca config user");
      throw new Error(r.errors[0].message || "can't update on the server");
    }
    r.updateActionPage.update = data.config.layout.update;
    return r.updateActionPage;
  };

  table = (r) => {
    super.table(r, null, null);
  };

  async run() {
    const { flags } = await this.parse();
    const wapi = new WidgetGet();
    const widget = await wapi.fetch(flags);
    const r = await this.rebuild({ widget });
    return this.output(r);
  }
}
