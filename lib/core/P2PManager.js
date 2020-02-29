// TODO: Use Socket.io instead?
import SimplePeer from 'simple-peer'
import { ADAPTER_EVENTS } from './Adapters'
import EventEmitter from 'eventemitter3'
import Rest from './REST'

export const EVENT_TYPES = {
  STREAM : {
    REQUEST : 'stream/request',
    READY : 'stream/ready',
    PROVIDE : 'stream/provide',
    PAUSE : 'stream/pause'
  },
  IDENTITY : {
    PROVIDE : 'identity/provide',
    REQUEST : 'identity/request',
    RESPONSE : 'identity/response'
  },
  ANNOUNCE : 'announce',
  SIGNAL : 'signal',
  PEER_CONNECT : 'peer/connect',
  PEER_DISCONNECT : 'peer/disconnect',
  PEER_MESSAGE : 'peer/message',
  PEER_ERROR : 'peer/error',
}
/**
 * @property {any} wrtc 
 * @typedef {Object} P2PManagerOptions
 * @property {SimplePeer.Options} spOptions 
 *  Options to pass to SimplePeer Instance.
 *  see https://github.com/feross/simple-peer#api
 * @property {import('./WSController').WSOptions} adapter  
 *  Options to pass to adapter
 *  For ws module see 
 */
export default class P2PManager extends EventEmitter {
  /**
   * This class manages the Peer To Peer Connections between 
   * all clients, including the virtual browswer. It exposes
   * an event emitter interface for easy management.
   * @param {string} server The location of the signaling server
   * @param {P2PManagerOptions} options 
   */
  constructor(options={}) {
    super()
    const { 
      spOptions = {},
      clientType = 'normal',
      adapter
    } = options
    this.id = null // set by signal server
    this.clientType = clientType
    this.adapter = adapter
    this.spOptions = spOptions
    this.WebSocket = WebSocket
    /** @type {Map<string, SimplePeer.Instance>} */
    this.peers = new Map()
    this._complete = null // set in init
  }

  setAdapter(adapter){
    this.adapter = adapter
  }

 /**
   * Establiashes the Websocket connection to our 
   * server and attaches events.
   * @returns {Promise<void>}
   */
  init(){
    return new Promise(async (resolve, reject) => {
      if(!this.adapter){
        return reject('No Adapter Found')
      }
      // ping the server to ensure this client has a session id
      await Rest.ping()
      // set up the adapter
      this.adapter.on(ADAPTER_EVENTS.IDENTITY.PROVIDE, (data) => {
        this.id = data.id
        resolve(this.id)
      })
      this.adapter.on(ADAPTER_EVENTS.ERROR, (err) => reject(err))
      this.adapter.on(ADAPTER_EVENTS.SIGNAL, (...args) => this._signal(...args))
      this.adapter.on(ADAPTER_EVENTS.ANNOUNCE, (...args) => this._announce(...args))
      this.adapter.init()
    })
  }

  /**
   * When SimplePeer emits a 'signal' event we ask the server
   * to send the event to the other client via our websocket 
   * connection.
   * @param {*} peer 
   * @param {*} signal 
   */
  _onPeerSignal(peer, signal){
    this.adapter.send(JSON.stringify({
      type: 'signal',
      target: peer.id,
      signal
    }))
  }

  /**
   * 
   * @param {SimplePeer.Instance} peer 
   */
  _onPeerConnection(peer){
    this.emit(EVENT_TYPES.PEER_CONNECT, peer)
    // request peer's identity
    const packet = this.package(EVENT_TYPES.IDENTITY.REQUEST)
    peer.send(packet)
  }

  _onPeerData(peer, chunk){
    const {type, ...data} = JSON.parse(chunk)
    if(!this[type]){
      console.warn(`[Wrtc] no handler for event: ${type}`)
      // console.log(JSON.parse(chunk))
      this.emit(EVENT_TYPES.PEER_MESSAGE, peer, {type, ...data})
      return 
    }
    this[type](peer, data)
  }

  _onPeerClose(peer){
    this.emit(EVENT_TYPES.PEER_DISCONNECT, peer.id)
    this.peers.delete(peer.id)
  }

  _onPeerError(peer, error){
    if(!this.listenerCount(EVENT_TYPES.PEER_ERROR)){
      console.error(peer.id, 'encountered an error', error.code)
      return console.error(error)
    }
    this.emit(EVENT_TYPES.PEER_ERROR, peer, error)
  }

  _onPeerStream(peer, stream){
    this.emit(EVENT_TYPES.STREAM.PROVIDE, peer, stream)
  }

  _announce(msg, initiator=true) {
    const peer = new SimplePeer({ ...this.spOptions, initiator })
    peer.id = msg.id || msg.cid || msg.sender
    this.peers.set(peer.id, peer)

    // Set events
    this._addPeerListeners(peer)

    return this;
  }

  /**
   * Add listeners to peer
   * @param {SimplePeer.Instance} peer 
   */
  _addPeerListeners(peer){
    peer.on('connect', () => this._onPeerConnection(peer))
    peer.on(  'error', (err) => this._onPeerError(peer, err))
    peer.on( 'signal', (signal) => this._onPeerSignal(peer, signal))
    peer.on(  'close', () => this._onPeerClose(peer))
    peer.on(   'data', (data) => this._onPeerData(peer, data))
    peer.on( 'stream', (stream) => this._onPeerStream(peer, stream))
  }

  /**
   * When signal event from Server
   * send a signal back to specified peer
   * @param {*} data 
   */
  _signal(data){
    const id = data.id || data.cid || data.sender
    if(!this.peers.has(id)){
      this._announce(data, false)
    }
    this.peers.get(id).signal(data.signal)
  }

  [EVENT_TYPES.STREAM.READY](peer){
    this.emit(EVENT_TYPES.STREAM.READY, peer)
  }

  /**
   * Returns the identity of this client when requested
   * @param {*} msg 
   */
  [EVENT_TYPES.IDENTITY.REQUEST](peer){
    const pData = {
      clientType : this.clientType
    }
    const packet = this.package(EVENT_TYPES.IDENTITY.RESPONSE, pData)
    peer.send(packet)
  }

  /**
   * Attaches a stream to a peer when requested
   * @param {*} msg 
   */
  [EVENT_TYPES.STREAM.REQUEST](peer){
    // const { sender } = msg
    // const peer = this.peers.get(sender)
    this.emit(EVENT_TYPES.STREAM.REQUEST, peer)
  }

  [EVENT_TYPES.IDENTITY.RESPONSE](peer, data){
    peer.clientType = data.clientType
    this.emit(EVENT_TYPES.IDENTITY.RESPONSE, peer, data)
  }
  /**
   * Package a payload of data
   * automatically attaches the sender id
   * @param {*} event 
   * @param {*} data 
   */
  package(event, data={}){
    return JSON.stringify({
      type : event,
      sender : this.id,
      ...data
    })
  }

  /**
   * Send a message to all connected peers
   * @param {*} msg 
   */
  broadcast(msg){
    for(let [, peer] of this.peers){
      peer.send(msg)
    }
    return this
  }

  /**
   * TODO: Destroy all of the peer connections
   */
  destroy(){
    return this
  }

  // some peer stuff
  requestStream(peer){
    peer.send(this.package(EVENT_TYPES.STREAM.REQUEST))
  }
}

P2PManager.EVENTS = EVENT_TYPES