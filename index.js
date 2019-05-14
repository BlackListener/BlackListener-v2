const { LoggerFactory } = require('logger.js')
const logger = LoggerFactory.getLogger('main', 'cyan')
const config = require('./config.json')
const { prefix } = config
const languages = {
  en: require('./lang/en.json'),
}
const dispatcher = require('bot-framework/dispatcher')
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  client.user.setActivity(`b!help | ${client.guilds.size} guilds`)
  logger.info('Bot is ready!')
})

client.on('message', async msg => {
  if (msg.content.startsWith(prefix)) {
    logger.info(`${msg.author.tag} sent command: ${msg.content}`)
    dispatcher(msg, languages.en, prefix, ['575673035743559701', '269500497327685633'], prefix)
  }
})

client.login(config.token)
