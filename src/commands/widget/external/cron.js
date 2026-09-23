import fs from "node:fs/promises";
import path from "node:path";
import { Flags } from "@oclif/core";
import { update } from "#src/commands/widget/external/index.mjs";
import Command from "#src/procaCommand.mjs";

export default class CounterExternal extends Command {
  static description =
    "Pull all external counters and save it into a widget extra Supporter. symlink the widget json into config/counter";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    "dry-run": Flags.boolean({
      description: "just fetch, don't update",
    }),
    id: Flags.integer({
      description: "process only this widget",
    }),
  };

  async monitored(only) {
    const dir = path.join(this.config.procaConfig.folder, "/counter");
    try {
      await fs.access(dir);
    } catch {
      this.error(`create the folder ${dir}`);
    }
    const entries = await fs.readdir(dir);
    const results = await Promise.all(
      entries.map(async (entry) => {
        const file = entry.split(".");
        if (file.length !== 2) {
          this.warn(`invalid file ${entry}`);
          return;
        }
        if (file[1] !== "json") {
          this.warn(`should be a json file ${entry}`);
          return;
        }
        let content;
        try {
          content = JSON.parse(
            await fs.readFile(path.join(dir, entry), "utf-8"),
          );
        } catch (e) {
          this.warn(`invalid json in ${entry}: ${e.message}`);
          return undefined;
        }
        if (!content.component.counter) {
          this.warn(`missing counter in config ${entry} ${content.filename}`);
          return undefined;
        }
        if (content.component.counter.path && content.component.counter.regex) {
          this.warn(`both path and regex in ${entry}, using regex`);
        }
        return {
          id: Number.parseInt(file[0]),
          name: content.filename,
          url: content.component.counter.url,
          path: content.component.counter.path,
          regex: content.component.counter.regex,
          campaign: content.component.counter.campaign,
          excludeWidget: content.component.counter.excludeWidget,
        };
      }),
    );
    return results.filter((d) => (only ? only === d.id : Boolean(d))).flat();
  }

  async run() {
    const { flags } = await this.parse(CounterExternal);
    const widgets = await this.monitored(flags.id);
    if (flags["dry-run"]) return this.output(widgets);
    const updated = await Promise.all(
      widgets.map(async (widget) => {
        return await update(widget);
      }),
    );
    return this.output(updated);
  }
}
