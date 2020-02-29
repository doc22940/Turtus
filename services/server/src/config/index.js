const dotenv = require('dotenv')
const path = require('path')
// parse dotenv as JSON
const {parsed = {}} = dotenv.config({
  debug : process.env.TURTUS_DEBUG_ENV,
})
for(let [key, value] of Object.entries(parsed)){
  value = process.env[key] || value
  try {
    parsed[key] = JSON.parse(value)
  } catch(e) {
    // pass
  }
}

module.exports = {
  TURTUS_SERVER_JWT_SECRET : 'turtus_jwt_secret_key',
  ...parsed
}