import program from 'commander'
import dotenv from 'dotenv'

dotenv.config()

// Try to parse process.env as json
Object.entries(process.env).forEach(([key, value]) => {
  try {
    process.env[key] = JSON.parse(value)
  } catch(e) {
    // pass
  }
})

const {
  TURTUS_VB_DEFAULT_WIDTH = 1280,
  TURTUS_VB_DEFAULT_HEIGHT = 720,
  TURTUS_VB_DEFAULT_BIT_DEPTH = 24,
  TURTUS_VB_DEFAULT_IDLE_TIMEOUT = 6 * 1000 * 1000, // 1 minute
  TURTUS_VB_DEFAULT_SIGNAL_SERVER,
  TURTUS_VB_DEFAULT_URL,
} = process.env;

program
  .option('-w, --width <number>', `Width of the browser window`, parseFloat)
  .option('-h, --height <number>', `Height of the browser window`, parseFloat)
  .option('-b, --bit-depth <number>', `Bit depth of the brwoser window`, parseFloat)
  .option('-s, --signal-server <url>', 'URL of signaling server')
  .option('-u, --default-url', 'The url to open in the browser')
  .parse(process.argv)

const args = program.opts()
// Delete undefined keys so that it works when spread
for(let key in args){
  if(typeof args[key] === 'undefined') delete args[key]
}

const defaults = {
  width: TURTUS_VB_DEFAULT_WIDTH,
  height: TURTUS_VB_DEFAULT_HEIGHT,
  bitDepth: TURTUS_VB_DEFAULT_BIT_DEPTH,
  timeout : TURTUS_VB_DEFAULT_IDLE_TIMEOUT,
  signalServer: TURTUS_VB_DEFAULT_SIGNAL_SERVER,
  defaultUrl: TURTUS_VB_DEFAULT_URL
}

export default { ...defaults, ...args }