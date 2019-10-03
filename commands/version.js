const { Command } = require('bot-framework')
const pkg = require('../package')
const git = require('simple-git/promise')

module.exports = class extends Command {
  constructor() {
    super('version')
  }

  async run(msg, lang, args, sendDeletable) {
    const application = await msg.client.fetchApplication()
    const tag = application.owner.discriminator === '0000' ? '<Unknown>' : application.owner.tag
    sendDeletable(`${pkg.name} v${pkg.version} @ ${(await git().revparse(['HEAD'])).slice(0, 7)}
     - Source Code: ${pkg.repository.url.replace('git+','')}
     - Bot owner: \`${tag}\` (ID: ${application.owner.id})
     - Invite bot: https://discordapp.com/oauth2/authorize?scope=bot&client_id=${msg.client.user.id}&permissions=8`)
  }
}
