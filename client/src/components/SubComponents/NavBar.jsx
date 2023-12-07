import React, { useState } from 'react'
import { AppBar, Toolbar, IconButton } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

import MenuIcon from '@mui/icons-material/Menu'

export default function NavBar() {
  const { authenticated, logout } = useAuth() // Get authentication state and logout function

  return (
    <React.Fragment>
      <AppBar color={'success'}>
        <Toolbar>
          <IconButton edge='start' color='inherit' aria-label='menu'>
            <MenuIcon />
          </IconButton>
          <IconButton color='inherit' component={Link} to='/'>
            Home
          </IconButton>
          <IconButton color='inherit' component={Link} to='/gamblin'>
            Gamblin'
          </IconButton>
          <IconButton color='inherit'>Winnin'</IconButton>
          <IconButton color='inherit'>Losin'</IconButton>
          <IconButton color='inherit'>Bettin'</IconButton>
          {/* Conditionally render based on authentication state */}
          {authenticated ? (
            <>
              <IconButton color='inherit' component={Link} to='/rankings'>
                Rankings!
              </IconButton>
              <IconButton color='inherit' component={Link} to='/gameView'>
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
              <IconButton color='inherit' component={Link} to='/'>
                Login'
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
