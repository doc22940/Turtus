// import InstructionBuffer, { opCodes } from './InstructionBuffer'
// import Keyboard from './keyboard'
import rest from './REST'
import Routes from './REST/endpoints'
/**
 * This class controls the Virtual Browser
 */
export default class VirtualBrowserController {
  constructor(client){
    this.client = client
  }

  static async createInstance(rid){
    const params = {
      rid
    }
    try{
      const result = await rest._request(Routes.VIRTUAL_BROWSER.START, 'GET', {params})
      return result
    }catch(e){
      return false
    }
  }

  mouseUp(x, y, btn){
    this.client.send(JSON.stringify({
      type : 'mouseUp',
      args : [x, y, btn]
    }))
  }
  /**
   * 
   * @param {Number} x x-position of mouse
   * @param {Number} y y-position of mouse
   * @param {1|2|3|4|5|6|7|8|9} btn Left (1), middle (2), right (3), middle-up (4), middle-down (5) \
   * middle-left (6), middle-right (7), browser-back (8), browser-forward (0)
   */
  mouseDown(x, y, btn){
    console.log('MouseDown', x, y, btn)
    this.client.send(JSON.stringify({
      type : 'mouseDown',
      args : [x, y, btn]
    }))
  }
  mouseMove(x, y){
    // if(!vidFocus) return false;
    // const inst = new InstructionBuffer(opCodes.MOUSE_MOVE, 4);
    // inst.writeUint16(x);
    // inst.writeUint16(y);
    this.client.send(JSON.stringify({
      type : 'mouseMove',
      args : [x, y]
    }))
  }
  keyDown(key){
    // if(!vidFocus) return false;
    // const inst = new InstructionBuffer(opCodes.KEY_DOWN, 2);
    // inst.writeUint16(key);
    this.client.send(JSON.stringify({
      type: 'keyDown',
      args : [key],
    }))
  }

  keyUp(key){
    // if(!vidFocus) return false;
    // const inst = new InstructionBuffer(opCodes.KEY_UP, 2);
    // inst.writeUint16(key);
    this.client.send(JSON.stringify({
      type: 'keyUp',
      args : [key],
    }))
  }
}