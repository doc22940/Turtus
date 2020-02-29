import P2PManager, { EVENT_TYPES as PEER_EVENTS } from './P2PManager'
import Adapters, { ADAPTER_EVENTS } from './Adapters'
import VBController from './VBController'
import RestController from './REST'
import Routes from './REST/endpoints'
import * as Auth from './Auth'

// Export default namespace
export default {
  Adapters,
  ADAPTER_EVENTS,
  Auth,
  PEER_EVENTS,
  P2PManager,
  RestController,
  Routes,
  VBController
}
// Export modules as well
export {
  Adapters,
  ADAPTER_EVENTS,
  Auth,
  PEER_EVENTS,
  P2PManager,
  RestController,
  Routes,
  VBController
}