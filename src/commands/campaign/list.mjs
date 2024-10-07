import {Args, Command, Flags} from '@oclif/core';
import {ux, error,stdout} from '@oclif/core/ux';
import { gql, query } from '#src/urql.mjs';

export default class CampaignList extends Command {
 static enableJsonFlag = true 

  static args = {
    name: Args.string({description: 'name of the campaign'}),
  }

  static description = 'list all the campaigns'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with no value (-f, --force)
    org: Flags.string({char: 'o', description: 'organisation coordinating the campaigns'})
  }

  Search = async (name) => {
 const SearchCampaignsDocument = gql`
    query SearchCampaigns($name: String!) {
  campaigns(name: $name) {
    id
    name
    title
    config
  }
}
    `;
    const result = await query (SearchCampaignsDocument, {name: name});
    if (!result.campaigns.length === 1) {
      throw new Error (name +" not found");
    }
    const campaign = result.campaigns[0];
    campaign.config = JSON.parse(campaign.config);
    return campaign;
  }

  async run() {
    const {args, flags} = await this.parse(CampaignList)
  console.log(args,flags);

  if (!args.name && !flags.org) {
    throw new Error (`${this.id} [name of the campaign] or -o [organisation]`);
  }

    if (args.name) {
      const r=await this.Search(args.name);
console.log(r);
    }

}
}
