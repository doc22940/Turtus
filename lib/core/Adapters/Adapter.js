import EventEmitter from "eventemitter3"

export const EVENT_TYPES = {
  CONNECTED : 'connected',
  DISCONNECTED : 'disconnected',
  ERROR : 'error',
  IDENTITY : {
    PROVIDE : 'identity/provide'
  },
  SIGNAL : 'signal',
  MESSAGE : 'message',
  ANNOUNCE : 'announce'
}

/**
 * Server adapter interface. Ex: Native WebSocket, Socket.io, etc...
 */
export default class Adapter extends EventEmitter {
  /**
   * Initialize the adapter
   */
  init(){
    return Promise.reject('Not Implemented')
  }
  /**
   * Send stringified data to the 
   * @param {String} dataa 
   */
  send(dataa){

  }
}

Adapter.EVENT_TYPES = EVENT_TYPES