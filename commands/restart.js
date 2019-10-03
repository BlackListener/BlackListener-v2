const { Command } = require('bot-framework')
const temp = require('../src/temp')

module.exports = class extends Command {
  constructor() {
    super('restart', { requiredOwner: true })
  }

  async run(msg, lang, args) {
    if (args[1] === '+force') {
      await msg.channel.send(':wave: (You\'ve +force\'d, it\'s not recommended!)')
      process.emit('restart')
      return
    }
    const message = await msg.channel.send('Waiting for finish...')
    const interval = setInterval(async () => {
      if (temp.processing < 3) {
        clearInterval(interval)
        await message.edit(':wave:')
        process.emit('restart')
      }
    }, 100)
  }
}
