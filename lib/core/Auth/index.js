import rest, { ROUTES } from '../REST'
import EventEmitter from 'eventemitter3'

const storageKey = 'turtus_auth'

export const authState = {
  authenticated : null,
  accessToken : null,
  user : null
}

const emitter = new EventEmitter()

readAuthState()

emitter.on('state', (state)=>{
  console.log('onState', state)
  if(!state.authenticated){
    return localStorage.removeItem(storageKey)
  }
  localStorage.setItem(storageKey, JSON.stringify(state))
})

function updateAuthState(obj={}, emit=true){
  const newState = { 
    ...authState,
    ...obj,
    lastUpdated : Date.now()
  }
  // create a new state object so that equivalency check 
  // can be performed from listeners
  emit && emitter.emit('state', newState)
  Object.assign(authState, newState)
}

// Called immediately upon requiring this module for the first time
function readAuthState(){
  const storedAuth = localStorage.getItem(storageKey)
  if(!storedAuth){
    updateAuthState({
      authenticated : false
    }, false)
  }else{
    updateAuthState({
      ...JSON.parse(storedAuth),
      authenticated : true
    }, false)
  }
}

/**
 * Subscribes a listener to changes in authState
 * and returns an unsubscription function
 * @param {function} fn 
 * @returns {()=>void}
 */
export function onAuthStateChange(fn){
  emitter.on('state', fn)
  return () => {
    emitter.off('state', fn)
  }
}

export async function loginWithCredentials(username, password){
    const url = ROUTES.LOGIN
    const data = { username, password }
    const result = await rest.request(url, 'POST', {data})
    // TODO: parse the token and such
    rest.token = result.token
    updateAuthState({
      authenticated : true,
      accessToken : result.token
    })
}

export async function logout(){
  rest.token = null
  updateAuthState({
    authenticated : false,
    accessToken : null
  })
}