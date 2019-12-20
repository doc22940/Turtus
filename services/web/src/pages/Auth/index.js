import React, { useState } from 'react'
import { Auth } from 'turtus/core'
import { Redirect } from 'react-router-dom'
import { Box, TextInput, Button} from 'grommet'
import useAuth from '../../lib/useAuth'

function DumbForm(props){
  const { onSubmit } = props
  const [values, setValues] = useState({})
  const [isValidating, setValidating] = useState(false)
  const [error, setError] = useState(null)

  function update(key, value){
    setValues(prev=>({...prev, [key] : value}))
  }

  function submit(){
    const { id, password } = values 
    if(!id || !password) return 
    if(isValidating) return 
    setValidating(true)
    setError(null)
    onSubmit(values, (err)=>{
      if(err){
        setError(err)
      }
      setValidating(false)
    })
  }
  return (
    <Box align="center" justify="center" fill>
      <Box width="medium" height="medium">
        Welcome To Turtus
        <TextInput 
          onChange={(e)=>update('id', e.target.value)}
          onKeyDown={e=>e.key==='Enter' && submit()}
          placeholder="username, email, or phone number..."/>
        <TextInput 
          onChange={(e)=>update('password', e.target.value)}
          onKeyDown={e=>e.key==='Enter' && submit()}
          placeholder="password" type="password"/>
        <Button onClick={submit}>Login</Button>
        <p style={{color:'red'}}>{error}</p>
        <span>Don't have an Account? Sign Up</span>
      </Box>
    </Box>
  )
}

// Login/Signup Page
export default function AuthPage(props){
  const { location } = props

  const { authenticated } = useAuth()

  async function login({id, password}, done){
    try {
      await Auth.loginWithCredentials(id, password)
    }catch(error){
      console.error(error.message)
      return done(error.message)
    }
    done()
  }

  if(authenticated){
    const to = location.state && location.state.from 
      ? location.state.from.pathname
      : '/'
    return <Redirect to={to}/>
  }

  return (
    <DumbForm onSubmit={login} />
  )
}