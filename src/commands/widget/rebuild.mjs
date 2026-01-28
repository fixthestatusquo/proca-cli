import { Flags } from "@oclif/core";
import { mergeAndConcat as merge } from "merge-anything";
import WidgetGet from "#src/commands/widget/get.mjs";
import WidgetList from "#src/commands/widget/list.mjs";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class WidgetRebuild extends Command {
  static description = "(re)build a widget or all the widgets of a campaign";

  static examples = [
    "$ proca-cli widget rebuild 42",
    "$ proca-cli widget rebuild climate-action/my-org/en",
    "$ proca-cli widget rebuild --campaign climate-action",
    "$ proca-cli widget rebuild --campaign climate-action",
  ];

  static args = this.multiid();

  static flags = {
    // flag with no value (-f, --force)
    ...this.flagify({ multiid: true }),
    campaign: Flags.string({
      char: "c",
      description: "Rebuild all widgets of that campaign",
      exclusive: ["id", "name", "dxid"],
    }),
    //    dryRun: Flags.boolean({
    //      description: 'Show what would be rebuilt without actually doing it',
    //    }),
  };

  update = async (data) => {
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
    return r.updateActionPage;
  };

  table = (r) => {
    super.table(r, null, null);
    r.config = JSON.parse(r.config);
    this.prettyJson(r.config);
  };

  async run() {
    const { flags } = await this.parse();
    const wapi = new WidgetGet();
    const data = await wapi.fetch(flags);
    const r = await this.update(
      merge(data, { config: { layout: { update: new Date().toISOString() } } }),
    );
    return this.output(r);
  }
}
