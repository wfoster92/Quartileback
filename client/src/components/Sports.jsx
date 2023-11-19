import { useState, useEffect, useContext } from 'react'
import { CFBContext } from '../contexts/cfbContext'
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
  const {
    currentSpread,
    setCurrentSpread,
    currentOverUnder,
    setCurrentOverUnder,
    currentGameInfo,
    setCurrentGameInfo,
    loading,
    setLoading,
    error,
    setError,
    allGames,
    setAllGames,
    currentGame,
    setCurrentGame,
    viewportWidth,
    setViewportWidth,
    setOU,
    setSpread,
    setOuIsInt,
    setSpreadIsInt,
    setFractionalOU,
  } = useContext(CFBContext)

  const Title = styled.div`
    font-size: 48px;
    margin-bottom: 32px;
    text-align: center;
  `
  const fetchSingleGameData = async () => {
    if (currentGame.length > 0) {
      const [team1, team2] = currentGame.split(' vs ')
      try {
        const response1 = await fetch(
          `http://localhost:3001/cfb/ouspread/${team1}/${team2}`
        )
        const result = await response1.json()
        const { spread, overUnder } = result
        setCurrentOverUnder(overUnder)
        setCurrentSpread(spread)

        const response2 = await fetch(
          `http://localhost:3001/cfb/bets/${team1}/${team2}`
        )
        const tempGameInfo = await response2.json()
        setCurrentGameInfo(tempGameInfo)
        console.log(`tempGameInfo.overUnder ${tempGameInfo.overUnder}`)
        let tempOU = Number(tempGameInfo.overUnder)
        let tempSpread = Number(tempGameInfo.gameLine)
        if (Number.isInteger(tempOU)) {
          setOuIsInt(true)
          setFractionalOU(false)
        } else {
          setOuIsInt(false)
          setFractionalOU(true)
        }
        if (Number.isInteger(tempSpread)) {
          setSpreadIsInt(true)
        } else {
          setSpreadIsInt(false)
        }
        setOU(Math.floor(tempOU))
        setSpread(Math.floor(tempSpread))
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
    setFractionalOU(false)
  }, [currentGame])

  useEffect(() => {
    getAllGames()
  }, [])

  const handleResize = () => {
    const newWidth = window.innerWidth
    console.log('New Viewport Width:', newWidth)
    setViewportWidth(newWidth)
  }

  useEffect(() => {
    console.log('hello')
    window.addEventListener('resize', handleResize, false)
    // handleResize()
    return window.removeEventListener('resize', handleResize, false)
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
        {currentGame ? (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div style={{ textAlign: 'center', marginTop: '64px' }}>
                Spread
              </div>
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
            <Grid item xs={12}>
              {/* {JSON.stringify(currentGameInfo, null, 2)} */}
            </Grid>
          </Grid>
        ) : (
          <>
            <Title>Please select a game.</Title>
            <img
              style={{ borderRadius: '16px', margin: 'auto', display: 'block' }}
              src={process.env.PUBLIC_URL + '/big_lebowski.jpeg'}
            ></img>
          </>
        )}
      </div>
    </>
  )
}

export default Sports
