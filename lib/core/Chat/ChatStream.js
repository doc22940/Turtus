import EventEmitter from 'eventemitter3'
import level from 'level'

/**
 * An anti-entropy gossip chat stream for p2p communication. 
 * @see http://www.cs.cornell.edu/home/rvr/papers/flowgossip.pdf
 * 
 */
export default class ChatStream extends EventEmitter {
  constructor(...peers){
    this.peers = new Map(peers.map(peer=>[peer.id, peer]))
    this.db = level('chat')
    this.peers.forEach(peer=>this.addPeer(peer))
  }

  _request(pid, ){}

  addPeer(peer){
    this.peers.set(peer.id, peer)
    // send the peer a copy of the chat log
  }

  /**
   * Signs the message via the backend
   * @param {*} data 
   */
  _sign(data, key){
    // TODO: Get signature from backend
    return JSON.stringify(data)
  }

  _verify(data){
    const { signature, ...rest } = data
    
  }

  send(message){
    // update chat log with newest message
    // push changes to all peers
    const data = {
      previous : null,
      author : '<author_id>',
      sequence : 1, // the number in the message
      timestamp : Date.now(),
      hash : 'sha256', // hash the message
      content : {
        type : 'post',
        text : message
      } 
    }
    message.signature = this._sign(data)
  }

  onMessage(){

  }

}