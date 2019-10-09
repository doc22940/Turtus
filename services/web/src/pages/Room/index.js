import React, { useEffect, useRef, useState } from 'react'
import turtus from 'turtus/core'
import { Box } from 'grommet'
import { useObserver } from 'mobx-react-lite'

import VideoStream from '../../components/VideoStream'
import VirtualBrowserController from '../../lib/BrowserController'
import WaitingElement from './WaitingElement'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import { video, ui } from '../../store'
import UserSettings from '../../components/UserSettings'

// Debug purposes 
window.turtus = turtus

export default function(props){
  const { 
    // todo: include room url
    match,
    server = `wss://${window.location.hostname}`
  } = props

  const [streamSource, setStreamSource] = useState()
  const [vbController, setVBController] = useState()
  const ref = useRef()

  useEffect(()=>{
    // TODO: 1. Get room information asynchronously 
    //       2. Determine if room is private, offline, etc.
    //       3. Determine room permission
    const opts = {}
    let wsurl = match.params.room 
      ? `${server}?rid=${match.params.room}`
      : server
    console.log(wsurl)
    // TODO: move this to a more global configuration
    const adapter = new turtus.Adapters.WebSocketAdapter(wsurl)
    const manager = new turtus.P2PManager(opts)
    manager.setAdapter(adapter)

    adapter.on(turtus.ADAPTER_EVENTS.CONNECTED, async () => {
      console.log('Websocket connection opened to server')
    })

    manager.on(turtus.PEER_EVENTS.PEER_CONNECT, (peer) => {
      console.log(`Peer Connected: ${peer.id}`)
    })

    manager.on(turtus.PEER_EVENTS.STREAM.READY, (peer)=>{
      video.setStreamMode('ready')
      manager.requestStream(peer)
    })
    
    manager.on(turtus.PEER_EVENTS.STREAM.PROVIDE, (peer, stream)=>{
      if(peer.clientType !== 'vb'){
        return
      }
      console.log('Virtual Browser Stream Received')
      setStreamSource(stream)
      // set the controller
      setVBController(new VirtualBrowserController(peer))
    })

    ;(async()=>{
      const id = await manager.init()
      console.log('Id:', id)
      console.log('Initialized')
      // setInitialized()
    })()

    return () => manager.destroy()
  }, [server])

  const toggleFullscreen = () => {
    // eslint-disable-next-line
    const prefixes = new Array('moz', 'ms', 'webkit')
    if(!document.fullscreenEnabled || !prefixes.some(prefix=>document[`${prefix}FullscreenEnabled`])){
      return false
    }
    return prefixes.some(prefix => {
      if(typeof document[`${prefix}FullscreenElement`] === 'undefined') return false
      if(!document[`${prefix}FullscreenElement`]) {
        ref.current[`${prefix}RequestFullscreen`]()
      }else{
        document[`${prefix}ExitFullscreen`]()
      }
      return true
    })
  }
  // Toggle fullscreen mode
  const isFullscreen = useObserver(()=>{
    return video.fullscreen
  })

  useEffect(()=>{
    if(isFullscreen === null) return
    toggleFullscreen(isFullscreen)
  }, [isFullscreen])

  // Create a virtual browser in this room
  const onRequestBrowser = async () => {
    console.log('🤔 Starting Browser')
    video.setStreamMode('loading')
    const didStart = await VirtualBrowserController.createInstance(match.params.room)
    if(!didStart){
      console.log('👎 Could not start browser')
      // wait 2 seconds before failing for UX reasons
      setTimeout(()=>video.setStreamMode(null), 2*1000)
    }
  }

  return useObserver(()=>(
    <Box 
      fill
      background="base"
      direction="row" 
      ref={ref}>
      <Toolbar />
      <VideoStream source={streamSource} vbController={vbController}>
        <WaitingElement onRequestBrowser={onRequestBrowser}/>
      </VideoStream>
      <Sidebar />
      <UserSettings />
    </Box>
  ))
}