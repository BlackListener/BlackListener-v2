const { ok_hand, x } = require('emojilib/emojis')
const { Command } = require('bot-framework')

module.exports = class extends Command {
  constructor() {
    super('nsfw')
  }

  async run(msg) {
    const removeOrAddRole = async (member, role) => {
      if (member.roles.has(role.id)) return await msg.member.removeRole(role)
      msg.member.addRole(role)
    }
    if (!msg.guild.roles.find(r => r.name === '🔑')) return msg.react(x.char)
    await removeOrAddRole(msg.member, msg.guild.roles.find(r => r.name === '🔑'))
    msg.react(ok_hand.char)
  }
}
