import { Flags } from "@oclif/core";
import oPath from "object-path";
import { updateCounter } from "#src/commands/widget/update/external.mjs";
import Command from "#src/gitCommand.mjs";

export const update = async (config) => {
  const d = new CounterExternal([]);
  //      const config = await d.getCounterConfig({id});
  if (!config) {
    console.warn("missing config");
    return undefined;
  }
  const counter = await d.fetchCounter(config);
  await updateCounter(config.id, counter);
  return { name: config.name, counter, id: config.id };
};

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

  async fetchCounter({ url, path, timeout = 10000, "dry-run": verbose }) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(timeout),
        headers: {
          "User-Agent": "proca/451.42",
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
      if (
        Number.isNaN(Number.parseFloat(counter)) ||
        !Number.isFinite(counter)
      ) {
        this.error(`Could not extract value from ${counter} at ${path}`, {
          exit: 1,
        });
      }
      return Number.parseFloat(counter);
    } catch (err) {
      if (err.name === "TimeoutError") {
        console.error("Request timed out after", timeout, "ms");
      } else if (err.cause?.code === "ETIMEDOUT") {
        console.error("Network timeout — server unreachable:", url);
      } else {
        throw err;
      }
    }
  }

  async getCounterConfig() {
    const data = await this.read();
    if (!data.component.counter)
      this.error(
        "missing config.component.counter {url, path} in ${this.getFile()}",
      );
    return data.component.counter;
  }

  async run() {
    const { flags } = await this.parse(CounterExternal);
    let counter = undefined;
    if (!flags.url && !flags.total) {
      const config = await this.getCounterConfig();
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
