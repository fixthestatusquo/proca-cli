import { Args, Command, Flags, ux } from "@oclif/core";
import debug from "debug";
import { parse as dxid, id } from "dxid";
import Table from "easy-table";
import fastcsv from "fast-csv";
import initHook from "#src/hooks/init.mjs";
import { createClient } from "#src/urql.mjs";

class ProcaCommand extends Command {
  static enableJsonFlag = true;
  procaConfig = { url: "https://api.proca.app/api" };
  format = "human"; // the default formatting
  flags = {};

  static baseFlags = {
    env: Flags.string({
      default: "default",
      description: "allow to switch between configurations (server or users)",
    }),
    json: Flags.boolean({
      helpGroup: "OUTPUT", // Optional, groups it under a specific help section if desired
      description: "Format output as json",
      exclusive: ["csv", "markdown"],
    }),
    csv: Flags.boolean({
      description: "Format output as csv",
      helpGroup: "OUTPUT", // Optional, groups it under a specific help section if desired
    }),
    markdown: Flags.boolean({
      description: "Format output as markdown table",
      helpGroup: "OUTPUT", // Optional, groups it under a specific help section if desired
    }),
    simplify: Flags.boolean({
      helpGroup: "OUTPUT",
      description:
        "flatten and filter to output only the most important attributes, mostly relevant for json",
      allowNo: true,
    }),
  };

  static multiid() {
    const args = {
      id_name_dxid: Args.string({
        ignoreStdin: true,
        hidden: true,
        description:
          "convenience, but try to use -i <id> or -x <dxid> or -n <name> instead",
      }),
    };
    return args;
  }

  static flagify({ multiid = false, name = false } = {}) {
    const flags = Object.assign({}, ProcaCommand.baseFlags);
    if (name || multiid) {
      flags.name = Flags.string({
        char: "n",
        description: "name (technical short name, also called slug)",
        helpValue: typeof name === "string" ? `<${name}>` : "<the_short_name>",
        parse: (input) => ProcaCommand.safeName(input),
      });
    }
    if (multiid) {
      flags.id = Flags.string({
        char: "i",
        parse: (input) => Number.parseInt(input, 10),
        exclusive: ["name", "dxid"],
      });
      flags.dxid = Flags.string({
        char: "x",
        description: "dxid",
      });
    }
    return flags;
  }

  static safeName = (input) => {
    const pattern = /^[a-zA-Z0-9\-_]+$/;
    if (!pattern.test(input)) {
      throw new Error(`Invalid characters in: ${input}`);
    }
    return input;
  };

  async parse() {
    const parsed = await super.parse();
    if (this.ctor.args.id_name_dxid === undefined) {
      return parsed;
    }
    const maybe = parsed.args.id_name_dxid;
    if (maybe) {
      const identified = [
        parsed.flags.name,
        parsed.flags.id,
        parsed.flags.dxid,
      ].filter(Boolean).length;

      if (identified > 0) {
        super.error("can't have --name, --id, or --dxid and an unamed arg", {
          code: 1,
        });
      }
      const d = dxid(maybe, false);
      if (d) parsed.flags.id = d;
      else parsed.flags.name = ProcaCommand.safeName(maybe);
    }
    if (parsed.flags.dxid) {
      parsed.flags.id = dxid(parsed.flags.dxid);
    }
    const identified = [
      parsed.flags.name,
      parsed.flags.id,
      parsed.flags.dxid,
    ].filter(Boolean).length;

    if (identified === 0) {
      super.error("One of --name, --id, or --dxid is required", {
        code: 1,
      });
    }

    return parsed;
  }

  static hooks = {
    init: async (options) => {
      console.log("init hook called", options);
      process.exit(1);
    },
  };
  async init() {
    await super.init();
    const { flags } = await this.parse();
    this.flags = flags;
    if (flags.json) this.format = "json";
    if (flags.csv) this.format = "csv";
    if (flags.markdown) this.format = "markdown";

    this.debug = debug("proca");
    initHook({ config: this.config });
    this.procaConfig = this.config.procaConfig; // set up from the hooks/init
    //    await this.config.runHook('init', { config: this.config });
    createClient(this.procaConfig);
  }

  async catch(err) {
    const entity = this.id.split(":")[0];
    if (err.graphQLErrors && err.graphQLErrors.length > 0) {
      err.graphQLErrors.forEach((graphqlErr) => {
        if (graphqlErr.extensions) {
          const code = graphqlErr.extensions.code;
          if (code === "not_found") {
            this.error(`${entity} not found`, { exit: 1 });
          }
        }
      });
    }

    if (err.networkError) {
      this.info("Looks like there’s a problem with your internet connection");
      this.error(err.networkError.cause, { exit: err.code || 1 });
    }
    if (err instanceof SyntaxError) {
      this.error(`Syntax error: ${err.message}`, { code: 1 });
    }

    // Default error handling
    this.error(err.message, { exit: err.code || 1 });
  }

  flatten = (obj, prefix = "", result = {}) => {
    Object.entries(obj).forEach(([k, v]) => {
      const newKey = Object.hasOwn(result, k) && prefix ? `${prefix}-${k}` : k;

      if (v?.constructor === Object) {
        this.flatten(v, newKey, result);
      } else {
        result[newKey] = v;
      }
    });
    return result;
  };

  simplify = (d) => {
    const r = {};
    for (const [key, value] of Object.entries(d)) {
      if (key === "__typename") continue;
      if (key === "config" && typeof value === "string") continue; // it's just a giant mess if not processed, let's skipt
      if (value === null) continue;
      if (typeof value === "string" || typeof value === "number") {
        r[key] = value;
        continue;
      }

      if (typeof value === "object") {
        if (value?.name) r[key] = value.name;
        continue;
      }
      r[key] = value;
    }
    return r;
  };

  tlog(color, ...msg) {
    const coloredMsg = msg.map((d) => ux.colorize(this.config.theme[color], d));
    this.log(...coloredMsg);
  }

  info(...msg) {
    this.tlog("info", msg);
  }

  prettyJson(obj) {
    if (typeof obj === "string") {
      obj = JSON.parse(obj);
    }
    this.log(ux.colorizeJson(obj, { theme: this.config.theme.json }));
  }

  warn(...msg) {
    this.tlog("warn", ...msg);
  }

  error(msg, options = {}) {
    const colouredMessage = `❌ ${ux.colorize(this.config.theme.error, msg)}`;
    super.error(colouredMessage, options);
  }

  async csv(data) {
    return new Promise((resolve, reject) => {
      let d = null;
      const format = this.flags.simplify
        ? this.simplify
        : (d) => this.flatten(d, "");
      if (Array.isArray(data)) {
        d = data.map(format);
      } else {
        d = [format(data)];
      }
      const stream = fastcsv
        .write(d, { headers: true })
        .on("finish", () => {
          console.log();
          resolve();
        })
        .on("error", reject);

      stream.pipe(process.stdout);
    });
  }

  markdown(raw) {
    if (!raw || raw.length === 0) return "";
    let data = [];
    const format = this.flags.simplify
      ? this.simplify
      : (d) => this.flatten(d, "");
    if (Array.isArray(raw)) {
      data = raw.map(format);
    } else {
      data = [format(raw)];
    }
    // Get all unique keys from all objects
    const keys = [...new Set(data.flatMap((obj) => Object.keys(obj)))];
    // Create header row
    const header = `| ${keys.join(" | ")} |`;
    const separator = `| ${keys.map(() => "---").join(" | ")} |`;

    // Create data rows
    const rows = data.map((obj) => {
      return `| ${keys
        .map((key) => {
          const value = obj[key];
          // Handle different value types
          if (value === null || value === undefined) return "";
          if (Array.isArray(value)) return `[Array(${value.length})]`;
          if (typeof value === "object") return "[Object]";
          return String(value);
        })
        .join(" | ")} |`;
    });

    this.log([header, separator, ...rows].join("\n"));
  }

  table(data, transformRow, print = (table) => table.toString()) {
    if (!transformRow) {
      if (this.flags.simplify !== false) {
        transformRow = (d, cell, idx) => {
          const r = this.simplify(d);
          if (r === null) return null;
          for (const [key, value] of Object.entries(r)) {
            cell(key, value);
          }
          return true;
        };
      } else {
        transformRow = (d, cell, idx) => {
          for (const [key, value] of Object.entries(this.flatten(d))) {
            cell(key, value);
          }
          return true;
        };
      }
    }
    const theme = this.config.theme;
    Table.prototype.pushDelimeter = function (cols) {
      // hack to change the formatting of the header
      cols = cols || this.columns();
      cols.forEach(function (col) {
        this.cell(
          col,
          undefined,
          Table.leftPadder(ux.colorize(theme.flagSeparator, "-")),
        );
      }, this);
      return this.newRow();
    };

    this.log(Table.print(data, transformRow, print));
  }

  single = (r) => {
    this.table(r, null, null);
  };

  async output(data, { single = false } = {}) {
    if (this.format === "json") {
      if (this.flags.simplify)
        return data?.map(this.simplify) || this.simplify(data);
      //      const isDirectCall = process.argv.join(":").includes(this.id);
      return data;
    }
    if (this.format === "markdown") {
      return this.markdown(data);
    }
    if (this.format === "csv") {
      return this.csv(data);
    }
    if (single === true) {
      return this.single(data);
    }
    return this.table(data);
  }
}

export { ProcaCommand as Command, Args, Flags };
export default ProcaCommand;
