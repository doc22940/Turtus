import React, { useMemo, useState } from 'react'
import { Box, Layer } from 'grommet'
import { useObserver } from 'mobx-react-lite'
import { ui } from '../store'
import styled from 'styled-components'

const UserSettingsTitleContianer = styled(Box)`
  cursor : pointer;
  span {
    transition : 50ms all ease-out;
  }
  &:hover > span {
    transform : scale(1.02);
  }
`

function UserSettingsTitle(props){
  const { 
    title, 
    isActive, 
    activate 
  } = props 

  if(typeof title === 'function'){
    return title(props)
  }
  
  return (
    <UserSettingsTitleContianer 
      isActive={isActive}
      background={isActive ? 'accent1' : 'base'}
      pad={{horizontal:'small', vertical:'xsmall'}}
      onClick={activate}>
      <span>{title}</span>
    </UserSettingsTitleContianer>
  )
}

export default function UserSettings(props){
  const { 
    activeIndex,
  } = props

  const menu = useMemo(()=>[
    { 
      title : 'General', 
      component : 'General Settings'
    },
    {
      title : 'Audio & Video',
      component : 'AV Settings'
    },
    {
      title : 'Notifications',
      component : 'Notification Settings'
    },
    {
      title : 'Privacy',
      component : 'Privacy Settings'
    },
    {
      title : 'Logout',
      component : 'Log Out',
    }
  ], [])

  const [_activeIndex, setActiveIndex] = useState(activeIndex || 0)

  const show = useObserver(()=>ui.settings.show)

  if(!show){
    return null
  }

  return (
    <Layer 
      onClickOutside={() => ui.set('settings', { show : false })}>
      <Box 
        pad={{vertical:'small'}}
        direction="row">
        <Box
          as="menu"
          border="right"
          direction="column">
            {menu.map((item, i)=>(
              <UserSettingsTitle 
                {...item} 
                isActive={i === _activeIndex}
                activate={()=>setActiveIndex(i)}/>
            ))}
        </Box>
        <Box 
          as="content" 
          width="medium"
          height="medium"
          pad={{horizontal:"small"}}
          flex="grow">
            {menu[_activeIndex].component}
        </Box>
      </Box>
    </Layer>
  )
}