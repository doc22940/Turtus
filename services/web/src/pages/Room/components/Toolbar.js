import React from 'react'
import { Box } from 'grommet'
import { useObserver } from 'mobx-react-lite'

import { video, ui } from '../../../store'
import Icon from '../../../icon-lib'

function ToolbarItem({
  icon,
  iconProps={},
  disabled = false,
  toggled = false,
  children, 
  size = 20, 
  ...props}
){
  return (
    <Box
      flex={false}
      style={{fontSize:size}}
      basis="xsmall" 
      justify="center"
      align="center"
      {...props} >
      { icon 
        ? <Icon color={disabled ? 'gray' : 'inherit'} icon={icon} {...iconProps}/>
        : children
      }
    </Box>
  )
}

export default function Toolbar(){
  return (
    <Box
      style={{display:video.fullscreen?'none':'flex'}}
      background="toolbar"
      direction="column"
      flex={false}
      basis="xsmall">
        <ToolbarItem 
          flex={false}
          basis="xxsmall"
          height="xxsmall" 
          background="header" 
          border="bottom">
          T
        </ToolbarItem>
        <Box>
          <ToolbarItem 
            size={32}
            onClick={()=>ui.set('settings', { show : true })}
            icon={'user-circle'}/>
          <ToolbarItem disabled icon={'microphone-slash'}/>
          <ToolbarItem disabled icon={'video-slash'}/>
        </Box>
        <Box fill justify="end">
          <ToolbarItem 
            onClick={()=>ui.set('theme', ({mode})=>({ mode : mode === 'dark' ? 'light':'dark'}))}
            icon={'moon'} 
            iconProps={{transform:'rotate-230'}}/>
        </Box>
    </Box>
  )
}