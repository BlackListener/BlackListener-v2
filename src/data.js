const Logger = require('logger.js').LoggerFactory
const args = require('minimist')(process.argv.slice(2))
const logger = Logger.getLogger('db', 'purple')
logger.info('Connecting...')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const config = require('../config.yml')
const sequelize = new Sequelize.Sequelize(config.database.name, config.database.user, config.database.pass, {
  host: 'localhost',
  dialect: config.database.type,
  storage: `${__dirname}/../database.sqlite`,
  logging: false,
})
sequelize.authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.')
  })
  .catch(err => {
    logger.emerg('Unable to connect to the database: ' + err)
    process.exit(1)
  })
const Server = sequelize.define('servers', {
  server_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  prefix: {
    type: Sequelize.STRING,
    defaultValue: config.prefix,
  },
  language: {
    type: Sequelize.STRING,
    defaultValue: 'en',
  },
  banned: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  point: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
})
const User = sequelize.define('users', {
  user_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  language: {
    type: Sequelize.STRING,
    defaultValue: null,
    allowNull: true,
  },
  banned: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  tag: {
    type: Sequelize.STRING,
    defaultValue: 'Unknown User#0000',
  },
})
const Bans = sequelize.define('bans', {
  ban_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  server_id: {
    type: Sequelize.STRING,
  },
  user_id: {
    type: Sequelize.STRING,
  },
  reason: {
    type: Sequelize.STRING,
  },
  evidences: {
    type: Sequelize.STRING,
  },
  expires: {
    type: Sequelize.DATE,
    allowNull: true,
  },
})
if (args.forceSync) logger.warn('Forced sync, it will drop table!!!')

sequelize.sync({ force: args.forceSync })

module.exports = {
  async getServer(server_id) {
    return (await Server.findOrCreate({
      where: { server_id },
      defaults: { server_id },
    }))[0]
  },
  async getUser(user_id) {
    return (await User.findOrCreate({
      where: { user_id },
      defaults: { user_id },
    }))[0]
  },
  updateUserTag(user_id, tag) {
    return User.update({ tag }, { where: { user_id } })
  },
  getBan(ban_id) {
    return Bans.findOne({
      where: { ban_id },
    })
  },
  getUserBans(user_id) {
    return Bans.findAll({
      where: {
        user_id,
        server_id: null,
      },
    })
  },
  getServerBans(server_id) {
    return Bans.findAll({
      where: {
        server_id,
        [Op.not]: { server_id: null },
      },
    })
  },
  getServerActiveBans(server_id) {
    return Bans.findAll({
      where: {
        server_id,
        expires: {
          [Op.not]: null,
          [Op.gte]: Date.now(),
        },
      },
    })
  },
  countUserBans(user_id) {
    return Bans.count({
      where: {
        user_id,
        server_id: null,
      },
    })
  },
  countServerActiveBans(server_id) {
    return Bans.count({
      where: {
        server_id,
        expires: {
          [Op.not]: null,
          [Op.gte]: Date.now(),
        },
      },
    })
  },
  addBan(user_id, server_id, reason, evidences) {
    return Bans.create({ user_id, server_id, reason, evidences })
  },
}
