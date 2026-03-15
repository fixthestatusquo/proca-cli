import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import { formatDistanceToNowStrict } from "date-fns";
import Command from "#src/procaCommand.mjs";
import {
  FragmentOrg,
  FragmentStats,
  FragmentSummary,
} from "#src/queries/campaign.mjs";
import { gql, mutation } from "#src/urql.mjs";

export default class Delete extends Command {
  static flags = {
    ...this.flagify({ name: "org", char: "o" }),
    ref: Flags.string({
      char: "c",
      required: true,
      description: "contact reference",
      helpValue: "from contact get",
    }),
  };

  delete = async (ref, org) => {
    const DeleteDocument = gql`mutation delete($ref: String!, $org: String!) {
  deleteContact (contactRef: $ref, orgName: $org) 
}`;

    const r = await mutation(DeleteDocument, {
      ref,
      org,
    });
    if (r.errors) {
      console.log(r);
      console.log("check your config $npx proca config user");
      throw new Error(r.errors[0].message || "can't delete");
    }
    console.log(r);
    return r.deleteContact;
  };

  async run() {
    const { flags } = await this.parse();
    const data = await this.delete(flags.ref, flags.name);
    return this.output(data, { single: true });
  }
}
