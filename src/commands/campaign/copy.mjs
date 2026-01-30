import { Flags } from "@oclif/core";
import CampaignAdd from "#src/commands/campaign/add.mjs";
import CampaignGet from "#src/commands/campaign/get.mjs";
import Command from "#src/procaCommand.mjs";

export default class CampaignCopy extends Command {
  static args = this.multiid();

  static description = "Copy campaign settings to a new campaign";

  static examples = [
    "<%= config.bin %> <%= command.id %> test_2025 --to test_2026",
    "<%= config.bin %> <%= command.id %> -n old_campaign --to new_campaign -o different_org",
  ];

  static flags = {
    ...this.flagify({ multiid: true }),
    to: Flags.string({
      char: "t",
      required: true,
      description: "new campaign name",
      helpValue: "<campaign name>",
    }),
    org: Flags.string({
      char: "o",
      description:
        "organization for the new campaign (defaults to source campaign org)",
      helpValue: "<org name>",
    }),
    title: Flags.string({
      description:
        "title for the new campaign (defaults to source campaign title)",
      helpValue: "<campaign title>",
    }),
    "dry-run": Flags.boolean({
      description: "preview changes without executing",
      default: false,
    }),
  };

  fetchCampaign = async ({ id, name }) => {
    const campaignGet = new CampaignGet([], this.config);
    return await campaignGet.fetch({ id, name });
  };

  async run() {
    const { flags } = await this.parse();
    const { id, name, to, org, title, "dry-run": dryRun } = flags;

    this.log(`Fetching source campaign: ${name || id}`);
    const sourceCampaign = await this.fetchCampaign({ id, name });

    const newCampaign = {
      name: to,
      title: title || sourceCampaign.title,
      org: org || sourceCampaign.org.name,
    };

    this.log("\n=== CAMPAIGN COPY ===");
    this.log(`Source: ${sourceCampaign.name}`);
    this.log("\nNew Campaign:");
    this.log(`  Name: ${newCampaign.name}`);
    this.log(`  Title: ${newCampaign.title}`);
    this.log(`  Org: ${newCampaign.org}`);

    if (dryRun) {
      this.log("\n[DRY RUN] No changes made");
      return newCampaign;
    }

    this.log(`\nCreating campaign: ${to}`);
    try {
      const campaignAdd = new CampaignAdd([], this.config);

      const result = await campaignAdd.create(
        {
          org: newCampaign.org,
          name: newCampaign.name,
          title: newCampaign.title,
        },
        sourceCampaign.config,
      );

      this.log(`✓ Campaign created: ${result.addCampaign.name}`);
      return this.output(result.addCampaign);
    } catch (error) {
      this.error(`Failed to create campaign: ${error.message}`);
      return;
    }
  }
}
