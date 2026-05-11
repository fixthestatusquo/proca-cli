import { Args, Flags, ux } from "@oclif/core";
import Command from "#src/procaCommand.mjs";
import { client, gql, query } from "#src/urql.mjs";

export default class ReplayAction extends Command {
  static description = "Replay actions for an organisation";

  static examples = [
    "<%= config.bin %> <%= command.id %> --org my_org 123 456 789",
    "<%= config.bin %> <%= command.id %> --org my_org --after 2026-04-01",
    "<%= config.bin %> <%= command.id %> --org my_org --after 2026-04-07T00:00:00Z --queue EMAIL_SUPPORTER",
    '<%= config.bin %> <%= command.id %> --org my_org --campaign "Save the Bees" --after 2026-01-01',
  ];

  static args = {
    ids: Args.integer({ description: "Action IDs", multiple: true }),
  };

  static flags = {
    ...super.globalFlags,
    org: Flags.string({
      char: "o",
      description: "organisation name",
      required: true,
    }),
    after: Flags.string({ char: "a", description: "ISO date" }),
    campaign: Flags.string({ char: "c", description: "campaign name" }),
    queue: Flags.string({
      char: "q",
      description: "target queue",
      default: "CUSTOM_ACTION_DELIVER",
      options: [
        "CUSTOM_ACTION_CONFIRM",
        "CUSTOM_ACTION_DELIVER",
        "CUSTOM_SUPPORTER_CONFIRM",
        "EMAIL_SUPPORTER",
        "SQS",
        "WEBHOOK",
      ],
    }),
  };

  async getActionIds(flags) {
    const ActionQuery = gql`
      query GetActions(
        $orgName: String!
        $after: DateTime
        $campaignName: String
      ) {
        actions(orgName: $orgName, after: $after, campaignName: $campaignName) {
          actionId
        }
      }
    `;

    const result = await query(ActionQuery, {
      orgName: flags.org,
      after: flags.after,
      campaignName: flags.campaign,
    });

    if (!result || !result.actions) return [];
    return result.actions.map((a) => Number.parseInt(a.actionId));
  }

  mutate = async (org, ids, queue) => {
    const Document = gql`
      mutation Requeue($org: String!, $ids: [Int!]!, $queue: Queue!) {
        requeueActions(orgName: $org, ids: $ids, queue: $queue) {
          count
          failed
        }
      }
    `;

    const result = await client
      .mutation(Document, { org, ids, queue })
      .toPromise();

    if (result.error) throw result.error;
    return result.data;
  };

  async run() {
    const { args, flags } = await this.parse(ReplayAction);
    // Do we need to feed it ids always?? it returns zero for empty array
    let ids = [];

    if (args.ids && args.ids.length > 0) {
      ids = args.ids;
    } else if (flags.after) {
      console.log(`Fetching actions since ${flags.after}...`);
      ids = await this.getActionIds(flags);
      console.log(`Found IDs: [${ids}]`);
    }

    ux.action.start(`Executing mutation with ${ids.length} IDs`);

    let result;
    try {
      // result is { requeueActions: { count: X, failed: Y } }
      result = await this.mutate(flags.org, ids, flags.queue);
      ux.action.stop();

      if (result?.requeueActions) {
        const { count, failed } = result.requeueActions;
        this.log(`✅ Success: ${count} replayed, ${failed} failed.`);
        return this.output(result.requeueActions);
      }
      this.warn(
        `Mutation finished, but result shape was unexpected: ${JSON.stringify(result)}`,
      );
    } catch (e) {
      ux.action.stop("error");
      this.error(`Command failed: ${e.message}`);
    }
  }
}
