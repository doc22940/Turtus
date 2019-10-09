import { grommet } from 'grommet'
import { deepMerge } from "grommet/utils"

const base = deepMerge(grommet, {
  global : {
    colors : {
      black : '#1F1F1F',
      white : '#FFFFFF'
    },
    size : {
      xsmall : '80px'
    }
  },
  tabs : {
    header : {
      background : 'header',
      extend : ()=>({
        justifyContent : 'space-around'
      })
    }
  },
  rangeInput : {
    thumb : {
      color : 'gray',
      extend : () => ({
        transform : 'scale(.5)'
      })
    },
    track : {
      // color : 'gray'
    }
  }
})

export const light = deepMerge(base, {
  global : {
    colors : {
      accent1 : '#939770',
      accent2 : '#364432',
      base : '#f4f6f8',
      toolbar : 'white',
      border : '#dadada',
      header : 'white'
    }
  }
})

// TODO
export const dark = deepMerge(base, {
  global : {
    colors : {
      accent1 : '#939770',
      accent2 : '#364432',
      base : '#121212',
      toolbar : 'black',
      border : '#0c0c0c',
      header : 'black'
    }
  }
})