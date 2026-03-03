import { readFile } from "node:fs/promises";
import { Flags } from "@oclif/core";
import oPath from "object-path";
import { updateCounter } from "#src/commands/widget/update/external.mjs";
import Command from "#src/procaCommand.mjs";

export default class CounterExternal extends Command {
  static description =
    "Pull external counter and save it into a widget extra Supporter";

  static examples = [
    "<%= config.bin %> <%= command.id %> --url https://mitmachen.wwf.de/node/506/polling",
  ];
  static args = this.multiid();

  static flags = {
    ...this.flagify({ multiid: true }),
    url: Flags.string({
      char: "u",
      description: "API endpoint URL to pull from",
      relationships: [{ type: "some", flags: ["path", "dry-run"] }],
    }),
    path: Flags.string({
      helpValue: "object.sub-object.total",
      description:
        "dot notation path to the counter field in the json returned by the url",
    }),
    total: Flags.integer({
      description: "number to add to the total",
      relationships: [
        // define complex relationships between flags
        { type: "none", flags: ["url", "path"] },
      ],
    }),
    timeout: Flags.integer({
      description: "Request timeout in milliseconds",
      default: 10000,
    }),
    "dry-run": Flags.boolean({
      description: "just fetch, don't update",
    }),
  };

  async fetchCounter({ url, path, timeout, "dry-run": verbose }) {
    const response = await fetch(url, {
      timeout,
      headers: {
        "User-Agent": "proca",
      },
    });

    if (!response.ok) {
      this.error(`API request failed with status ${response.status}`, {
        exit: 1,
      });
    }

    const data = await response.json();
    if (verbose) {
      this.log(JSON.stringify(data, null, 2));
    }
    const counter = oPath.get(data, path);
    if (Number.isNaN(Number.parseFloat(counter)) || !Number.isFinite(counter)) {
      this.error(`Could not extract value from ${counter} at ${path}`, {
        exit: 1,
      });
    }
    return Number.parseFloat(counter);
  }

  async getCounterConfig(id) {
    const folder = this.procaConfig.folder;
    const filePath = `${folder}/${id}.json`;

    const data = await readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    return jsonData.component.counter;
  }

  async run() {
    const { flags } = await this.parse(CounterExternal);
    let counter = undefined;
    if (!flags.url) {
      const config = await this.getCounterConfig(flags.id);
      flags.url = config.url;
      flags.path = config.path;
    }

    if (flags.url) {
      counter = await this.fetchCounter(flags);
    }
    if (flags.total) {
      counter = flags.total;
    }
    if (flags["dry-run"]) {
      return this.output(
        {
          counter,
          url: flags.url,
          //            response: JSON.stringify(data, null, 2),
        },
        { single: true },
      );
    }

    const updated = await updateCounter(flags.id, counter);
    return this.output(updated, { single: true });
  }
}
