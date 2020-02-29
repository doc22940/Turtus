import Adapter, { EVENT_TYPES } from './Adapter'

const world = typeof global === 'undefined' ? globalThis : global 

/**
 * @typedef WSOptions
 * @property {WebSocket} useWebSocket
 */
export default class WebSocketAdapter extends Adapter {
  /**
   * 
   * @param {string} server 
   * @param {WSOptions} options 
   */
  constructor(server, options={}){
    super()
    const { 
      useWebSocket,
      protocols,
      ...opts
    } = options
    this.id = null
    this.server = server
    /** @type {WebSocket || import('ws')} */
    this.WebSocket = useWebSocket 
      ? useWebSocket 
      : world.WebSocket
    this.protocols = protocols
    this.options = opts
    this.ws = null
  }

  init(){
    if(this.ws){
      throw new Error('Init already called')
    }
    this.ws = new this.WebSocket(this.server, this.protocols, this.options)

    this.ws.addEventListener(   'open', (e) => this._onServerConnection(e))
    this.ws.addEventListener(  'close', (e) => this._onServerClose(e))
    this.ws.addEventListener(  'error', (err) => this._onServerError(err))
    this.ws.addEventListener('message', (msg) => this._onServerMessage(msg))
  }

  send(data){
    this.ws.send(data)
  }

  /**
   * set identity
   * @param {*} data 
   */
  _setIdentity(data){
    const { id } = data
    this.id = id
  }

  /**
   * Called when a message is received from the ws connection
   * This will always be a JSON
   * @param {string} message 
   * @param  {...any} args 
   */
  _onServerMessage(message){
    const data = JSON.parse(message.data || message) 
    const { type, ...rest } = data
    if(type === EVENT_TYPES.IDENTITY.PROVIDE){
      this._setIdentity(rest)
    } else if(!this.listenerCount('message') && !this.listenerCount(type)){
      return console.warn(`[WS] no handler for event: ${type}`)
    }
    this.emit(type, rest)
    this.emit('message', data, message)
  }

  _onServerConnection(event){
    this.emit(EVENT_TYPES.CONNECTED, event)
  }

  _onServerClose(event){
    this.emit(EVENT_TYPES.DISCONNECTED, event)
  }

  _onServerError(err){
    if(!this.listenerCount(EVENT_TYPES.ERROR)){
      console.error('WebSocket Server Error')
      console.error(err)
    }
    this.emit(EVENT_TYPES.ERROR, err)
  }
}