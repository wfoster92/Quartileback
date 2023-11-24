import { useState, useEffect, useContext, useCallback } from 'react'
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
    allFutureGames,
    allPastGames,
    setAllPastGames,
    setAllFutureGames,
    currentGame,
    setCurrentGame,
    viewportWidth,
    setViewportWidth,
    setOU,
    setSpread,
    setOuIsInt,
    setSpreadIsInt,
    setFractionalOU,
    setFractionalSpread,
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
          setFractionalSpread(false)
        } else {
          setSpreadIsInt(false)
          setFractionalSpread(true)
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
      const [pastGames, futureGames] = await response.json()
      setAllPastGames(pastGames)
      setAllFutureGames(futureGames)
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

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth
    console.log('New Viewport Width:', newWidth)
    setViewportWidth(newWidth)
  }, [])

  useEffect(() => {
    console.log('hello')
    window.addEventListener('resize', handleResize, false)
    return () => window.removeEventListener('resize', handleResize, false)
  }, [handleResize])

  const handleGameChange = (event) => {
    console.log(event.target.value)
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: 210, margin: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Future Game</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={
                  allFutureGames.includes(currentGame) ? currentGame : null
                }
                label='Future Game'
                onChange={handleGameChange}
              >
                {allFutureGames.map((game) => {
                  return <MenuItem value={game}>{game}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: 210, margin: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>Past Game</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={allPastGames.includes(currentGame) ? currentGame : null}
                label='Past Game'
                onChange={handleGameChange}
              >
                {allPastGames.map((game) => {
                  return <MenuItem value={game}>{game}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Box>
          <h1
            style={{
              position: 'absolute',
              textAlign: 'center',
              fontSize: '64px',
              top: '96px',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {currentGame}
          </h1>
        </div>

        {currentGame ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={1}>
              <Grid
                item
                xs={11}
                md={5.5}
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  margin: '2vw',
                }}
              >
                <h1 style={{ textAlign: 'center', marginTop: '64px' }}>
                  Spread
                </h1>
                <Spread data={currentSpread} />
              </Grid>
              <Grid
                item
                xs={11}
                md={5.5}
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  margin: '2vw',
                }}
              >
                <h1 style={{ textAlign: 'center', marginTop: '64px' }}>
                  Over Under
                </h1>
                <div style={{ textAlign: 'center' }}>
                  <OverUnder data={currentOverUnder} />
                </div>
              </Grid>
              <Grid item xs={12}>
                {/* {JSON.stringify(currentGameInfo, null, 2)} */}
              </Grid>
            </Grid>
          </div>
        ) : (
          <>
            <Title>Please select a game.</Title>
            <img
              style={{ borderRadius: '16px', margin: 'auto', display: 'block' }}
              src={process.env.PUBLIC_URL + '/big_lebowski_dude.webp'}
              // src={process.env.PUBLIC_URL + '/big_lebowski_nam.jpeg'}
            ></img>
          </>
        )}
      </div>
    </>
  )
}

export default Sports
