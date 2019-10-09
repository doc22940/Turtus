import React, { useMemo, useState } from 'react'
import { Box, Layer } from 'grommet'
import { useObserver } from 'mobx-react-lite'
import { ui } from '../store'

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
    <Box onClick={activate}>
      {title}
    </Box>
  )
}

export default function UserSettings(props){
  const { 
    activeIndex,
  } = props
  const menu = useMemo(()=>[
    { 
      title : 'User Settings', 
    },
    {
      title : 'Audio/Video Settings'
    },
    {
      title : 'Dangerous Settings'
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
      <Box direction="row">
        <Box 
          as="menu" 
          direction="column">
            {menu.map((item, i)=><UserSettingsTitle {...item} activate={()=>setActiveIndex(i)}/>)}
        </Box>
        <Box 
          as="content" 
          flex="grow">
            {menu[_activeIndex].component}
        </Box>
      </Box>
    </Layer>
  )
}