const { Command } = require('bot-framework')
const YAML = require('yaml')
const fs = require('fs').promises

module.exports = class extends Command {
  constructor() {
    const opts = {
      args: ['config set/show [set:id] [set:value]'],
      permission: 8,
      requiredOwner: true,
    }
    super('fuck', opts)
  }

  async run(msg, lang, args, sendDeletable) {
    if (args[1] === 'config') {
      if (args[2] === 'set') {
        if (!args[4]) sendDeletable('Not enough args.')
        const config = require(__dirname + '/../config.yml')
        if (!Object.keys(config).includes(args[3]))
          return sendDeletable('Not found config key, correct keys are: ' + Object.keys(config).map(c => `\`${c}\``).join(', '))
        config[args[3]] = args[4]
        await fs.writeFile(`${__dirname}/../config.yml`, YAML.stringify(config))
        sendDeletable(`Config(\`${args[3]}\`) has been successfully saved to \`${args[4]}\`.`)
      }
    } else return sendDeletable('Not correct args, please see the help. (help fuck)')
  }
}
