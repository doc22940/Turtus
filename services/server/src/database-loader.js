const turtus = require('turtus/server')

const isProd = /^prod/i.test(process.env.NODE_ENV)

console.log('Starting in', isProd ? 'production' : 'development', 'mode')

const docker = new turtus.Local.Docker()
const db = new turtus.Local.Storage()
const cm = new turtus.ClientManager({storage:db})

// TODO: Check configs and determine best driver for the program
module.exports = {
  docker,
  db,
  cm
}