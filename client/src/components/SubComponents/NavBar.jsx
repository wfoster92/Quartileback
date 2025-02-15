import React, { useState } from 'react'
import { AppBar, Toolbar, IconButton } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

import MenuIcon from '@mui/icons-material/Menu'
// import Favicon from '/favicon.ico'

export default function NavBar() {
  const { authToken, logout, isTokenValid } = useAuth() // Get authentication state and logout function
  console.log(authToken, isTokenValid())

  return (
    <React.Fragment>
      <AppBar color={'success'}>
        <Toolbar>
          <IconButton edge='start' color='inherit' component={Link} to='/'>
            <img
              src='/favicon.ico'
              alt='Favicon'
              height={'32px'}
              width={'32px'}
              style={{ borderRadius: '4px' }}
            />
          </IconButton>
          <IconButton color='inherit' component={Link} to='/'>
            Rankings
          </IconButton>
          {/* Conditionally render based on authentication state */}
          {authToken && isTokenValid() ? (
            <>
              <IconButton color='inherit' component={Link} to='/gameSelect'>
                Games!
              </IconButton>
              <IconButton color='inherit' component={Link} to='/portfolio'>
                Portfolio!
              </IconButton>
              <IconButton color='inherit' onClick={logout}>
                Logout
              </IconButton>
            </>
          ) : (
            <>
              {/* <IconButton color='inherit' component={Link} to='/gamblin'>
                Gamblin'
              </IconButton> */}
              <IconButton color='inherit' component={Link} to='/login'>
                Login
              </IconButton>
              {/* You can add more links for registration, etc. */}
            </>
          )}
          {/* <IconButton color='inherit' href='/sports'>
            Sports!
          </IconButton> */}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  )
}
