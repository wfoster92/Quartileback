import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

export default function NavBar() {
  // const classes = useStyles()
  const [example, setExample] = useState('success')

  return (
    <React.Fragment>
      <AppBar
        color={example}
        // color={isCustomColor || isCustomHeight ? 'primary' : example}
        // className={`${isCustomColor && classes.customColor} ${
        //   isCustomHeight && classes.customHeight
        // }`}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => setExample('success')}>
            Gamblin'
          </IconButton>
          <IconButton color="inherit" onClick={() => setExample('primary')}>
            Winnin'
          </IconButton>
          <IconButton color="inherit" onClick={() => setExample('error')}>
            Losin'
          </IconButton>
          <IconButton color="inherit" onClick={() => setExample('warning')}>
            Bettin'
          </IconButton>
          <IconButton color="inherit" onClick={() => setExample('transparent')}>
            Sports!
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  )
}
