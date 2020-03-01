import React from 'react'
import turtus from 'turtus/core'
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
    const isAuthorized = Boolean(turtus.RestController.token)
    return done(isAuthorized)
  }
  // TODO: use mobx to switch themes/preferences
  return (
    <Grommet theme={theme} >
      <FullScreen>
        <ResetCSS />
        <BrowserRouter>
          <Box background="base" direction="column" width="100vw" height="100vh">
            <Box fill>
              <Route exact path="/" component={RoomPage} />
              <Route exact path="/auth" exact component={AuthPage} />
              <AuthRoute exact path="/r/:room" component={RoomPage} />
            </Box>
          </Box>
        </BrowserRouter>
      </FullScreen>
    </Grommet>
  )
}