import React from 'react'
import { Box, RangeInput } from 'grommet'
import Icon from '../icon-lib'

export default function VolumeSlider(props){
  const { 
    volume = 0,
    muted = false,
    onToggleMute,
    onChange
  } = props
  const isMuted = volume <= 0 || muted
  const icon = isMuted 
    ? 'volume-mute'
    : volume < 80 
      ? 'volume-down'
      : 'volume-up'

  const onSliderChange = (e) => {
    const val = e.target.value 
    if(isMuted){
      onToggleMute && onToggleMute(false)
    }
    onChange && onChange(val)
  }
  // TODO: Changing the icon moves the range slider which causes a glitchy effect
  // therefore the icon needs to have a fixed size
  return (
    <Box direction="row" align="center">
      <Icon
        style={{flexBasis:'15%', flex : 0}}
        data-tip={isMuted ? "Unmute" : "Mute"} 
        onClick={()=>onToggleMute()}
        icon={icon} />
      <RangeInput
        value={isMuted ? 0 : volume}
        onChange={onSliderChange}
        min={0}
        max={100}
        step={1}/>
    </Box>
  )
}