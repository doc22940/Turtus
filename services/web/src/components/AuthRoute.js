import React, { useEffect, useState} from 'react'
import { Route, Redirect } from 'react-router-dom'

export default function AuthRoute(props){
  const { 
    verify,
    component : Component, 
    ...routeProps 
  } = props

  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(()=>{
    const done = (isAuthenticated) => {
      setIsAuthenticated(Boolean(isAuthenticated))
    }
    typeof verify === 'function' && verify(done)
  }, [])

  if(isAuthenticated === null || typeof isAuthenticated === 'undefined'){
    return <Route {...routeProps} render={()=>null}/>
  }
  
  return (
    <Route {...routeProps} render={(props)=>{
      if(isAuthenticated === null || typeof isAuthenticated === 'undefined'){
        return null
      }
      if(isAuthenticated){
        return <Component {...props} /> 
      }
      return <Redirect to={{
        pathname:'/auth',
        state : { from : props.location }
      }} />
    }}/>
  )
}