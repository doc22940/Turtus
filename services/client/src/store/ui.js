import { observable, action } from 'mobx'

export default observable({
    settings : {
      show : false
    },
    toolbar : {
      show : true, 
      collapsed : true
    },
    sidebar : {
      show : true
    },

    theme : {
      mode : 'dark'
    },

    set(setting, fn){
      if(typeof fn !== 'function'){
        return this[setting] = {...this[setting], ...fn}
      }
      this[setting] = { ...this[setting] ,...fn(this[setting])}
    }
  },{
    set : action
  }
)