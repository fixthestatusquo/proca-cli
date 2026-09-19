import { Flags } from "@oclif/core";
import { getWidget } from "#src/commands/widget/get.mjs";
import { updateCounter } from "#src/commands/widget/update/external.mjs";
import Command from "#src/procaCommand.mjs";

export default class CounterIncrease extends Command {
  static description =
    "Increase a widget's external counter by a step and save it";

  static examples = [
    "<%= config.bin %> <%= command.id %> 42 --step 10",
    "<%= config.bin %> <%= command.id %> -n campaign/petition --step 5",
  ];

  static args = this.multiid();

  static flags = {
    ...this.flagify({ multiid: true }),
    step: Flags.integer({
      char: "s",
      description: "value to add to the current external counter",
      atLeastOne: ["step", "goal"],
    }),
    goal: Flags.integer({
      char: "g",
      description: "target counter; no increase once reached",
    }),
  };

  async run() {
    const { flags } = await this.parse(CounterIncrease);
    const widget = await getWidget(flags);
    const current = widget.extraSupporters || 0;

    if (flags.goal && current >= flags.goal) {
      this.log(`goal of ${flags.goal} reached (${current}), not increasing`);
      return this.output(widget, { single: true });
    }

    // no step: pick 4-6% of the goal
    const step =
      flags.step ??
      Math.max(1, Math.round(flags.goal * (0.04 + Math.random() * 0.02)));

    const updated = await updateCounter(widget.id, current + step);
    return this.output(updated, { single: true });
  }
}
