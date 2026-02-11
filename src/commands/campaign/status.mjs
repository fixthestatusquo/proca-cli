import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class CampaignStatus extends Command {
  static args = this.multiid();
  static aliases = ["campaign:close"];

  static examples = [
    "<%= config.bin %> <%= command.id %> -name <campaign> --end=2025-01-02 --status=close",
  ];

  static isCloseCommand =
    process.argv.includes("close") ||
    this.commandPath?.includes("close") ||
    this.id?.includes("close");

  static flags = {
    ...this.flagify({ name: "campaign" }),
    status: Flags.string({
      description: "Status to set",
      required: true,
      default: this.isCloseCommand ? "close" : undefined,
      options: ["draft", "live", "closed", "ignored"],
    }),
    start: Flags.string({
      description: "start date of the campaign",
      helpValue: "YYYY-MM-DD",
      parse: async (input) => {
        const date = new Date(input);
        if (Number.isNaN(date.getTime())) {
          throw new Error(`Invalid date: ${input}`);
        }
        return date;
      },
    }),
    end: Flags.string({
      description: "end date of the campaign",
      helpValue: "YYYY-MM-DD",
      parse: async (input) => {
        const date = new Date(input);
        if (Number.isNaN(date.getTime())) {
          throw new Error(`Invalid date: ${input}`);
        }
        return date;
      },
    }),
  };

  updateStatus = async (props) => {
    const Query = gql`
mutation (
$id: Int
$name: String
$input: CampaignInput!
) {
  updateCampaign (id:$id, name: $name, input: $input) {
    name
    org {name}
    status
    start
    end
    title
  }
}`;
    const input = {
      status: props.status.toUpperCase(),
    };

    const result = await mutation(Query, {
      //			org: props.org,
      id: props.id,
      name: props.name,
      input: input,
    });

    return result.updateCampaign;
  };

  async run() {
    const { flags } = await this.parse();

    const data = await this.updateStatus(flags);

    return this.output(data, { single: true });
  }
}
