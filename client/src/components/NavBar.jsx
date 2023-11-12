import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import { Link } from 'react-router-dom'

import MenuIcon from '@mui/icons-material/Menu'

export default function NavBar() {
  // const classes = useStyles()

  return (
    <React.Fragment>
      <AppBar color={'success'}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <IconButton color="inherit" href="/">
            Home
          </IconButton>
          <IconButton color="inherit" href="/gamblin">
            Gamblin'
          </IconButton>
          <IconButton color="inherit">Winnin'</IconButton>
          <IconButton color="inherit">Losin'</IconButton>
          <IconButton color="inherit">Bettin'</IconButton>
          <IconButton color="inherit" href="/sports">
            Sports!
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  )
}
