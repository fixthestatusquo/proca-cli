import { Flags } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class CounterUpdate extends Command {
  static description =
    "Update the global counter to add the actions collected elsewhere";

  static examples = ["see also <%= config.bin %> contact count"];
  static args = this.multiid();

  static flags = {
    ...this.flagify({ multiid: true }),
    total: Flags.string({
      char: "t",
      description: "new total to include",
      required: true,
      parse: (input) => Number.parseInt(input, 10),
    }),
  };

  async updateCounter(id, counter) {
    const PushWidgetDocument = gql`
mutation updateActionPage($id: Int!, $counter: Int!) {
  updateActionPage(id: $id, input: {extraSupporters:$counter}) {
    id, name, locale
    ...on PrivateActionPage { extraSupporters }
  }
}`;
    const r = await mutation(PushWidgetDocument, {
      id,
      counter,
    });
    if (r.errors) {
      console.log(r);
      console.log("check your config $npx proca config user");
      throw new Error(r.errors[0].message || "can't update on the server");
    }
    return r.updateActionPage;
  }

  async run() {
    const { flags } = await this.parse(CounterUpdate);

    try {
      const updated = await this.updateCounter(flags.id, flags.total);
      return this.output(updated, { single: true });
    } catch (error) {
      this.error(error.message, { exit: 1 });
    }
  }
}
