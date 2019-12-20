import React, { useEffect, useState} from 'react'
import { Route, Redirect } from 'react-router-dom'
import useAuth from '../lib/useAuth'

/**
 * This has to be a separate component so that 
 * useAuth isn't called on every instance of 
 * AuthRoute, rather only on Router instances 
 * that match the current url
 */
function RenderOrRedirect({Component, ...props}){
  const {authenticated} = useAuth()
  // authState is still loading for some reason(?)
  if(authenticated === null || typeof authenticated === 'undefined'){
    return null
  }
  if(authenticated){
    return <Component {...props} /> 
  }
  return <Redirect to={{
    pathname:'/auth',
    state : { from : props.location }
  }} />
}

export default function AuthRoute(props){
  const { 
    component, 
    ...routeProps 
  } = props

  return (
    <Route 
      {...routeProps} 
      render={(props) => (
        <RenderOrRedirect 
          Component={component} 
          {...props}/>
      )} 
    />
  )
}