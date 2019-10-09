const ClientManager = require('../lib/ClientManager')

const cm = new ClientManager()

/**
 * 
 * @param {WebSocket} client 
 * @param {Express.Request} req 
 */
module.exports = function(client, req){
  // TODO: factor in user accounts?
  const { rid } = req.query
  const id = req.sessionID
  cm.connect(id, client, rid)
}