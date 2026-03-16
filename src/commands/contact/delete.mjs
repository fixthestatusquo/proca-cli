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
      throw new Error(r.errors[0].message || "can't delete");
    }
    return r;
  };

  async run() {
    const { flags } = await this.parse();
    const data = await this.delete(flags.ref, flags.name);
    return this.output(data);
  }
}
