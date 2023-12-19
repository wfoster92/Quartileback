import { useState, useEffect, useContext } from 'react'
import { GamesContext } from '../../contexts/GamesContext'
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import Typography from '@mui/material/Typography'
import { TextField } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'

const TableContainer = (props) => {
  const { TableComponent, title } = props
  const {
    // searchStrRankings,
    // setSearchStrRankings,
    viewportWidth,
  } = useContext(GamesContext)

  const [searchStr, setSearchStr] = useState('')

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'inline-block' }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
            }}
          >
            <Typography
              sx={{ flex: '1 1 100%' }}
              variant='h6'
              id='tableTitle'
              component='div'
            >
              {title}
            </Typography>
            <TextField
              style={{ marginLeft: '8px', width: '210px' }}
              id='outlined-basic'
              label='Search'
              variant='outlined'
              value={searchStr}
              onChange={(e) => setSearchStr(e.target.value.toString())}
              InputLabelProps={{
                style: { zIndex: 0 },
              }}
            />
          </Toolbar>
        </div>
      </div>

      <TableComponent searchStr={searchStr} />
    </>
  )
}

export default TableContainer
