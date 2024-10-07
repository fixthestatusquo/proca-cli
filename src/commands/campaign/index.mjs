import {Args, Command, Flags} from '@oclif/core'

export default class Campaign extends Command {
  static args = {
    person: Args.string({description: 'Person to say campaign to', required: true}),
  }

  static description = 'Say aaa'

  static examples = [
    `<%= config.bin %> <%= command.id %> friend --from oclif
campaign friend from oclif! (./src/commands/campaign/index.ts)
`,
  ]

  static flags = {
    from: Flags.string({char: 'f', description: 'Who is saying campaign', required: true}),
  }

  async run() {
    const {args, flags} = await this.parse(Campaign)

    this.log(`campaign ${args.person} from ${flags.from}! (./src/commands/campaign/index.ts)`)
  }
}
