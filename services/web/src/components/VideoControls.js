import React from 'react'
import { Box } from 'grommet'
import Icon from '../icon-lib'
import { video } from '../store'
import { useObserver } from 'mobx-react-lite'
import VolumeSlider from './VolumeSlider'
import ReactTooltip from 'react-tooltip'

export default function VideoControls(){
  return useObserver(() => (
    <Box
      flex={false}
      style={{fontSize:22}}
      pad={{horizontal:'small', vertical:'xsmall'}}
      direction="row">
        <ReactTooltip />
        <Box 
          justify="start"
          align="center"
          direction="row" 
          basis={'1/3'}>
          <VolumeSlider 
            onChange={(vol)=>video.setVolume(vol)}
            onToggleMute={(val)=>video.toggleMute(val)} 
            volume={video.volume}
            muted={video.muted}/>
        </Box>
        <Box 
          justify="center"
          align="center"
          direction="row" 
          basis={'1/3'}>
          <Icon data-tip="Stop Stream" icon="stop-circle" />
        </Box>
        <Box
          basis={'1/3'}
          direction="row" 
          align="center"
          justify="end">
          <Icon style={{marginRight:12}} data-tip="Stream Settings" icon={'cog'} />
          <Icon data-tip="Toggle Fullscreen" icon={video.fullscreen ? 'compress' : 'expand'} onClick={()=>video.toggleFullscreen()}/>
        </Box>
    </Box>
  ))
}