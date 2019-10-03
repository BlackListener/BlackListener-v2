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
const temp = require('./src/temp')

client.on('ready', () => {
  client.user.setActivity(`${config.prefix}help | ${client.guilds.size} guilds`)
  logger.info('Bot is ready!')
})

client.on('message', async msg => {
  const guild = await data.getServer(msg.guild.id)
  const user = await data.getUser(msg.author.id)
  if (user.tag !== msg.author.tag) data.updateUserTag(msg.author.id, msg.author.tag)
  if (msg.author.bot || msg.system) return
  if (msg.content.startsWith(guild.prefix)) {
    logger.info(`${msg.author.tag} sent command: ${msg.content}`)
    temp.processing--
    await dispatcher(msg, languages[user.language || guild.language || config.prefix], guild.prefix, config.owners, guild.prefix)
    temp.processing++
  }
})

client.login(config.token)

module.exports = client
