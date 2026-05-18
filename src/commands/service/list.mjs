import Org from "#src/commands/org/get.mjs";
import Command from "#src/procaCommand.mjs";

export default class OrgServices extends Command {
  static description = "list services set for an organisation";
  static args = this.namearg();

  static flags = {
    ...this.flagify({ single: true, name: "organisation", char: "o" }),
  };

  async run() {
    const { flags } = await this.parse();
    const orgCmd = new Org({}, this.config);
    const org = await orgCmd.fetch({ name: flags.name });
    this.output(org.services);
  }
}
