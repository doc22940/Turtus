import { observable, action } from 'mobx'

export default observable({
    fullscreen : null,
    overlayComments : false,
    volume : 0,
    muted : false,
    streamMode : null,

    toggleFullscreen(isEnabled){
      this.fullscreen = typeof isEnabled !== 'undefined' 
        ? Boolean(isEnabled) 
        : !this.fullscreen
    },

    setVolume(volume){
      if(typeof volume === 'undefined'){
        return
      }
      this.volume = volume
    },

    toggleMute(isMuted){
      console.log('Toggling Mute', this.muted)
      this.muted = typeof isMuted !== 'undefined' 
        ? Boolean(isMuted)
        : !this.muted
      // if unmuted but volume is 0, set some default value
      if(this.muted === true && this.volume <= 0){
        this.volume = 50
      }
    },

    setStreamMode(mode){
      this.streamMode = mode
    }
  },{
    toggleFullscreen : action,
    toggleMute : action,
    setVolume : action,
    setStreamMode : action
  }
)