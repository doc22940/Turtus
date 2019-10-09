import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Box, Grommet } from 'grommet'
import { useObserver } from 'mobx-react-lite'

import './icon-lib.js'
import RoomPage from './pages/Room'
import AuthPage from './pages/Auth'
import FullScreen from './components/layouts/FullScreen'
import ResetCSS from './ResetCSS'
import * as themes from './theme'
import ui from './store/ui.js'
import AuthRoute from './components/AuthRoute.js'


export default function App() {
  const theme = useObserver(()=>{
    return themes[ui.theme.mode] || themes.light
  })

  // Verify the auth state of current user
  const getAuthState = async (done) => {
    // TODO: If auth state loaded, use that
    // otherwise retreive auth state
    return done(true)
  }
  // TODO: use mobx to switch themes/preferences
  return (
    <Grommet theme={theme} >
      <FullScreen>
        <ResetCSS />
        <BrowserRouter>
          <Box background="base" direction="column" width="100vw" height="100vh">
            <Box fill>
              <Route path="/" exact component={RoomPage} />
              <Route path="/auth" exact component={AuthPage} />
              <AuthRoute verify={getAuthState} path="/r/:room" component={RoomPage} />
            </Box>
          </Box>
        </BrowserRouter>
      </FullScreen>
    </Grommet>
  )
}