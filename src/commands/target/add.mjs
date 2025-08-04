import fs from "node:fs";
import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
import { gql, mutation, query } from "#src/urql.mjs";

export default class TargetAdd extends Command {
	static flags = {
		// flag with no value (-f, --force)
		...this.flagify({ multiid: false }),
		campaign: Flags.string({
			char: "c",
			description: "mtt campaign to add the target",
			required: true,
		}),
		name: Flags.string({
			description: "name of the target",
			required: true,
		}),
		email: Flags.string({
			description: "email of the target",
			required: true,
		}),
		external_id: Flags.string({
			description: "external id of the target",
		}),
	};

	getCampaignId = async (name) => {
		const Document = gql`
query getCampaignId($campaign: String!) {
  campaign (name:$campaign) { id 
  }
}`;

		const result = await query(Document, {
			campaign: name,
		});
		return result.campaign.id;
	};

	create = async (flags) => {
		const id = await this.getCampaignId(flags.campaign);

		const Document = gql`
      mutation (
        $campaignId: Int!
        $outdatedTargets: OutdatedTargets
        $targets: [TargetInput!]!
      ) {
        upsertTargets(
          campaignId: $campaignId
          outdatedTargets: $outdatedTargets
          targets: $targets
        ) {
          area
          emails {
            email
            emailStatus
            error
          }
          externalId
          fields
          id
          locale
          name
        }
      }
    `;
		const result = await mutation(Document, {
			campaignId: id,
			outdatedTargets: "KEEP",
			targets: [
				{
					name: flags.name,
					externalId: flags.external_id,
					emails: [{ email: flags.email }],
				},
			],
		});
		return result.upsertTargets;
	};

	async run() {
		//const { args, flags } = await this.parse(CampaignAdd);
		const { args, flags } = await this.parse();
		if (!flags.external_id) {
			flags.external_id = `${flags.campaign}_${flags.email}`;
		}

		const data = await this.create(flags);
		return this.output(data);
	}
}
