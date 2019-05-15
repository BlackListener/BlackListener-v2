require('./src/yaml')
const { LoggerFactory } = require('logger.js')
const logger = LoggerFactory.getLogger('main', 'cyan')
const config = require('./config.yml')
const languages = {
  en: require('./lang/en.json'),
}
const data = require('./src/data')
const dispatcher = require('bot-framework/dispatcher')
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  client.user.setActivity(`${config.prefix}help | ${client.guilds.size} guilds`)
  logger.info('Bot is ready!')
})

client.on('message', async msg => {
  if (msg.author.bot || msg.system) return
  const guild = await data.getServer(msg.guild.id).then(g => g.toJSON())
  if (msg.content.startsWith(guild.prefix)) {
    logger.info(`${msg.author.tag} sent command: ${msg.content}`)
    dispatcher(msg, languages.en, guild.prefix, ['575673035743559701', '269500497327685633'], guild.prefix)
  }
})

client.login(config.token)
