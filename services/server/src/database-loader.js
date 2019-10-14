const isProd = /^prod/i.test(process.env.NODE_ENV)

console.log('Starting in', isProd ? 'production' : 'development', 'mode')

const turtus = require('turtus/server')

// TODO: Check configs and determine best driver for the program
module.exports = {
  docker : new turtus.Local.Docker(),
  db : new turtus.Local.Storage()
}