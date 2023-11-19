import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import csv from 'csvtojson'
import Spread from './Spread'
import OverUnder from './OverUnder'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Grid } from '@mui/material'
const Sports = () => {
  const [currentSpread, setCurrentSpread] = useState({})
  const [currentOverUnder, setCurrentOverUnder] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allGames, setAllGames] = useState([])
  const [currentGame, setCurrentGame] = useState('')

  const fetchSingleGameData = async () => {
    if (currentGame.length > 0) {
      const [team1, team2] = currentGame.split(' vs ')
      try {
        const response = await fetch(
          `http://localhost:3001/cfb/${team1}/${team2}`
        )
        const result = await response.json()
        const { spread, overUnder } = result
        setCurrentOverUnder(overUnder)
        setCurrentSpread(spread)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
  }

  const getAllGames = async () => {
    try {
      const response = await fetch(`http://localhost:3001/cfb/getAllGames`)
      const games = await response.json()
      console.log(games)
      // games = games.map((f) => {})
      setAllGames(games)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSingleGameData()
  }, [currentGame])

  useEffect(() => {
    getAllGames()
  }, [])

  const handleGameChange = (event) => {
    setCurrentGame(event.target.value)
  }

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }
  return (
    <>
      <div>
        <Box sx={{ width: 210, margin: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Game</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={currentGame}
              label='Game'
              onChange={handleGameChange}
            >
              {allGames.map((game) => {
                return <MenuItem value={game}>{game}</MenuItem>
              })}
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div style={{ textAlign: 'center', marginTop: '64px' }}>Spread</div>
            <Spread data={currentSpread} />
          </Grid>
          <Grid item xs={6}>
            <div style={{ textAlign: 'center', marginTop: '64px' }}>
              Over Under
            </div>
            <div style={{ textAlign: 'center' }}>
              <OverUnder data={currentOverUnder} />
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default Sports
