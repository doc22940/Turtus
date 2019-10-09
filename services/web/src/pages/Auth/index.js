import React from 'react'
import { Box, TextInput} from 'grommet'

// Login/Signup Page
export default function Auth(){
  return (
    <Box align="center" justify="center" fill>
      <Box width="medium" height="medium">
        Welcome To Turtus
        <TextInput placeholder="username, email, or phone number..."/>
        <TextInput placeholder="password" type="password"/>
        <span>Don't have an Account? Sign Up</span>
      </Box>
    </Box>
  )
}