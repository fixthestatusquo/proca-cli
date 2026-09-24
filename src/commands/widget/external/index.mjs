import { Flags } from "@oclif/core";
import oPath from "object-path";
import { getCount } from "#src/commands/contact/count.mjs";
import { updateCounter } from "#src/commands/widget/update/external.mjs";
import Command from "#src/gitCommand.mjs";

export const update = async (config) => {
  const d = new CounterExternal([]);
  //      const config = await d.getCounterConfig({id});
  if (!config) {
    console.warn("missing config");
    return undefined;
  }
  let counter = 0;
  if (config.url) {
    counter = await d.fetchCounter(config);
  }
  if (config.campaign) {
    const name = config.name;
    config.name = undefined; //can't have the name on the fetch, it would be used as the campaign name
    //config.simplify = false;
    counter = await getCount(config);
    config.name = name;
  }

  await updateCounter(config.id, counter);
  return { name: config.name, counter, id: config.id };
};

export default class CounterExternal extends Command {
  static description =
    "Pull external counter and save it into a widget extra Supporter";

  static examples = [
    "<%= config.bin %> <%= command.id %> --url https://example.org/api --path data.total",
    "<%= config.bin %> <%= command.id %> --url https://example.org/stats --regex 'data-value=\"([0-9]+)\"'",
  ];
  static args = this.multiid();

  static flags = {
    ...this.flagify({ multiid: true }),
    url: Flags.string({
      char: "u",
      description: "API endpoint URL to pull from",
      relationships: [{ type: "some", flags: ["path", "regex", "dry-run"] }],
    }),
    path: Flags.string({
      helpValue: "object.sub-object.total",
      description:
        "dot notation path to the counter field in the json returned by the url",
      relationships: [{ type: "none", flags: ["regex"] }],
    }),
    regex: Flags.string({
      helpValue: 'data-value="(d+)"',
      description:
        "regex with a capture group to extract the counter from the html returned by the url",
      relationships: [{ type: "none", flags: ["path"] }],
    }),
    total: Flags.integer({
      description: "number to add to the total",
      relationships: [
        // define complex relationships between flags
        { type: "none", flags: ["url", "path", "regex"] },
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

  async fetchCounter({
    url,
    path,
    regex,
    timeout = 10000,
    "dry-run": verbose,
  }) {
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

      let counter;
      if (regex) {
        const html = await response.text();
        if (verbose) {
          this.log(html);
        }
        const match = html.match(new RegExp(regex));
        if (!match) {
          this.error(`Could not match ${regex} on ${url}`, { exit: 1 });
        }
        counter = match[1] ?? match[0];
      } else {
        const data = await response.json();
        if (verbose) {
          this.log(JSON.stringify(data, null, 2));
        }
        counter = oPath.get(data, path);
      }

      const value = Number.parseFloat(counter);
      if (Number.isNaN(value) || !Number.isFinite(value)) {
        this.error(
          `Could not extract value from ${counter} at ${path ?? regex}`,
          { exit: 1 },
        );
      }
      return value;
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
        "missing config.component.counter {url, path} or {url, regex} in ${this.getFile()}",
      );
    return data.component.counter;
  }

  async run() {
    const { flags } = await this.parse(CounterExternal);
    let counter = undefined;
    let config = {};
    if (!flags.url && !flags.total) {
      config = await this.getCounterConfig();
      flags.url = config.url;
      flags.path = config.path;
      flags.regex = config.regex;
    }

    if (flags.url) {
      counter = await this.fetchCounter(flags);
    }
    if (flags.total) {
      counter = flags.total;
    }
    if (config.campaign) {
      config.simplify = false;
      const result = await getCount(config);
      config.widget = result.widget;
      config.excluded = result.excluded;
      counter = result.supporterCount;
    }

    if (flags["dry-run"]) {
      return this.output(
        {
          counter,
          url: flags.url || undefined,
          campaign: config.campaign || undefined,
          excludeWidget: config.widgetId || undefined,
          name: config.widget || undefined,
          excluded: config.excluded || undefined,
          //            response: JSON.stringify(data, null, 2),
        },
        { single: true },
      );
    }

    const updated = await updateCounter(flags.id, counter);
    return this.output(updated, { single: true });
  }
}
