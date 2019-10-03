const { LoggerFactory } = require('logger.js')
const logger = LoggerFactory.getLogger('main', 'blue')
const { AtomicReference } = require('bot-framework')
const client = new AtomicReference()

const start = async () => {
  logger.info('Booting...')
  await client.set(require('./client'))
  if (await client.get() === null || await client.get() === undefined) logger.warn('client is null')
}

const stop = async () => {
  await (await client.get()).destroy()
  logger.info('Bot has been stopped.')
  await client.set(null)
  Object.keys(require.cache).forEach(e => { (!e.endsWith('.js') && !e.includes('Logger') && !e.endsWith('.json')) || delete require.cache[e]})
}

const restart = async () => {
  logger.info('Restarting!')
  await stop()
  await start()
}

process.on('restart', () => restart())

start()
