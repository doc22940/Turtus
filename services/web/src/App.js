import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Box, Grommet } from 'grommet'
import { useObserver } from 'mobx-react-lite'

import './icon-lib.js'
import RoomPage from './pages/Room'
import FullScreen from './components/layouts/FullScreen'
import ResetCSS from './ResetCSS'
import * as themes from './theme'
import ui from './store/ui.js'


export default function App() {
  const theme = useObserver(()=>{
    return themes[ui.theme.mode] || themes.light
  })
  // TODO: use mobx to switch themes/preferences
  return (
    <Grommet theme={theme} >
      <FullScreen>
        <ResetCSS />
        <BrowserRouter>
          <Box direction="column" width="100vw" height="100vh">
            <Box fill>
              <Route path="/" exact component={RoomPage} />
            </Box>
          </Box>
        </BrowserRouter>
      </FullScreen>
    </Grommet>
  )
}