import { Args, Flags } from "@oclif/core";
import { error, stdout, ux } from "@oclif/core/ux";
import Command from "#src/procaCommand.mjs";
//import {FragmentSummary,} from "#src/queries/org.mjs";
import { gql, query } from "#src/urql.mjs";

export default class OrgGet extends Command {
	static description = "view a org";

	static examples = ["<%= config.bin %> <%= command.id %> <name of the ngo>"];

	static args = this.multiid();

	static flags = {
		// flag with no value (-f, --force)
		...this.flagify({ multiid: false }),
		name: Flags.string({
			char: "n",
			charAliases: ["o"],
			description: "name of the org",
			helpValue: "<org name>",
		}),
		config: Flags.boolean({
			description: "display the config",
			default: false,
			allowNo: true,
		}),
		keys: Flags.boolean({
			default: true,
			allowNo: true,
		}),
		campaigns: Flags.boolean({
			default: false,
			allowNo: true,
		}),
		users: Flags.boolean({
			default: true,
			allowNo: true,
		}),
	};

	fetch = async (params) => {
		const GetOrgDocument = gql`
      query GetOrg($name: String!, $withCampaigns: Boolean = true, $withKeys: Boolean = true) {
        org (name: $name) {
          id name title
          config
          keys @include(if: $withKeys) {id, name, expired, expiredAt, public}
 
          campaigns @include(if: $withCampaigns) {id, name, title, org {name}}
   personalData {
      contactSchema
      doiThankYou
      highSecurity
      replyEnabled
      supporterConfirm
      supporterConfirmTemplate
    }
    processing {
      customActionConfirm
      customActionDeliver
      customEventDeliver
      customSupporterConfirm
      detailBackend
      doiThankYou
      emailBackend
      emailFrom
      emailTemplates
      eventBackend
      pushBackend
      storageBackend
      supporterConfirm
      supporterConfirmTemplate
    }

    services {
      host
      id
      name
      path
      user
    }
        }
      }
    `;

		const result = await query(GetOrgDocument, {
			name: params.name,
			withCampaigns: params.campaigns,
			withKeys: params.keys || true,
		});
		//    result.org.config = JSON.parse (result.org.config);
		return result.org;
	};

	simplify = (d) => {
		const result = {
			id: d.id,
			Name: d.name,
			Title: d.title,
			"can targets reply?": d.replyEnabled ? true : undefined,
			"confirm actions?": d.supporterConfirm
				? d.supporterConfirmTemplate
				: undefined,
		};
		if (this.flags.stats) {
			result["#Supporters"] = d.stats.supporterCount;

			this.actionTypes.forEach((type) => {
				const action = d.stats.actionCount.find(
					(action) => action.actionType === type,
				);
				if (action) result[`#${type}`] = action.count;
			});
		}
		return result;
	};

	table = (r) => {
		r.config = JSON.parse(r.config);
		super.table(r, null, null);
		if (this.flags.config) {
			r.config.locales = undefined;
			this.prettyJson(r.config);
		}
	};

	async run() {
		const { args, flags } = await this.parse();
		const data = await this.fetch(flags);
		return this.output(data);
	}
}
