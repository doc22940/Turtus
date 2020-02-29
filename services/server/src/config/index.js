const dotenv = require('dotenv')
const path = require('path')

dotenv.parse()
// Try to parse process.env as json
Object.entries(process.env).forEach(([key, value]) => {
  try {
    process.env[key] = JSON.parse(value)
  } catch(e) {
    // pass
  }
})
// Set some default values
process.env = {
  TURTUS_SERVER_JWT_SECRET : 'turtus_jwt_secret_key',
  ...process.env,
}