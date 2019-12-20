import { useState, useEffect } from 'react'
import { Auth } from "turtus/core"

/**
 * A hook used to get and respond to turtus Auth
 */
export default function useAuth(){
  const [curr, setState] = useState(Auth.authState)
  useEffect(() => {
    return Auth.onAuthStateChange(function(next){
      console.log('Auth State Change')
      if(curr === next){
        return 
      }
      setState(next)
    })
  }, [])
  return curr
}