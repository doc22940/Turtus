import React from 'react' 
import { Box, Tabs, Tab } from 'grommet'
import { useObserver } from 'mobx-react-lite'

import ChatItem from './ChatItem'
import Chat from './Chat'
import Icon from '../../../icon-lib'
import { video } from '../../../store'


function CustomTab({children}){
  return (
    <Box 
      basis="xxsmall"
      width="xxsmall"
      align="center"
      justify="center">
      {children}
    </Box>
  )
}

export default function Sidebar(props){
  return useObserver(()=>(
    <Box 
      style={{display:video.fullscreen?'none':'flex'}}
      basis="medium">
      <Tabs>
        <Tab 
          plain
          title={
            <CustomTab>
              <Icon icon={'users'}/>
            </CustomTab>
          }>
          <Box
            flex="shrink"
            basis="medium">
            <ChatItem />
          </Box>
        </Tab>
        <Tab plain
          title={
            <CustomTab>
                <Icon icon={'comment'}/>
            </CustomTab>
          }>
          <Chat />
        </Tab>
        <Tab plain 
          title={
            <CustomTab>
              <Icon icon={'cog'}/>
            </CustomTab>
          }>
          TODO: Settings
        </Tab>
      </Tabs>
    </Box>
  ))
}