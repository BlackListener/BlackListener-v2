const { Command } = require('bot-framework')
const YAML = require('yaml')
const fs = require('fs').promises
const deleteCache = require('../src/functions/deleteCache')

module.exports = class extends Command {
  constructor() {
    const opts = {
      args: ['config get/set/list [get/set:id] [set:value]'],
      permission: 8,
      requiredOwner: true,
    }
    super('fuck', opts)
  }

  async run(msg, lang, args, sendDeletable) {
    if (args[1] === 'config') {
      if (args[2] === 'set') {
        if (!args[4]) sendDeletable('Not enough args.')
        deleteCache(__dirname + '/../config.yml')
        const config = require(__dirname + '/../config.yml')
        if (!Object.keys(config).includes(args[3]))
          return sendDeletable('Not found config key, valid keys are: ' + Object.keys(config).map(c => `\`${c}\``).join(', '))
        config[args[3]] = args[4]
        await fs.writeFile(`${__dirname}/../config.yml`, YAML.stringify(config))
        sendDeletable(`Config(\`${args[3]}\`) has been successfully saved to \`${args[4]}\`.`)
      } else if (args[2] === 'list') {
        deleteCache(__dirname + '/../config.yml')
        const config = require(__dirname + '/../config.yml')
        const list = Object.keys(config).map(k => `${k}: ${config[k].toString().replace(msg.client.token, '<token>')}`).join('\n')
        sendDeletable(`Current config:\n\`\`\`yaml\n${list}\n\`\`\``)
      } else if (args[2] === 'get') {
        if (!args[3]) sendDeletable('Not enough args.')
        deleteCache(__dirname + '/../config.yml')
        const config = require(__dirname + '/../config.yml')
        if (!Object.keys(config).includes(args[3]))
          return sendDeletable('Not found config key, valid keys are: ' + Object.keys(config).map(c => `\`${c}\``).join(', '))
        sendDeletable(`Current config of \`${args[3]}\`: \`${config[args[3]].toString().replace(msg.client.token, '<token>')}\``)
      } else return sendDeletable('Not correct args, please see the help. (help fuck)')
    } else return sendDeletable('Not correct args, please see the help. (help fuck)')
  }
}
