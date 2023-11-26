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
    allCFBGames,
    setAllCFBGames,
    allNBAGames,
    setAllNBAGames,
    allNFLGames,
    setAllNFLGames,
    gamesObj,
    setGamesObj,
  } = useContext(CFBContext)

  const Title = styled.div`
    font-size: 48px;
    margin-bottom: 32px;
    text-align: center;
  `
  const fetchSingleGameData = async () => {
    if (currentGame.length > 0) {
      const [away, home] = currentGame.split(' ')
      try {
        const response = await fetch(`/cfb/bets/${away}/${home}`)
        const tempGameInfo = await response.json()
        setCurrentGameInfo(tempGameInfo)
        // console.log(`tempGameInfo.overUnder ${tempGameInfo.overUnder}`)
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
      const response = await fetch(`/cfb/getAllGames`)
      // const response = await fetch(`http://localhost:3001/cfb/getAllGames`)
      const [pastGames, futureGames] = await response.json()
      setAllPastGames(pastGames)
      setAllFutureGames(futureGames)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const getAllGameData = async () => {
    try {
      const response = await fetch(`/games/getAllDatasets`)
      const [gameData, cfbGames, nbaGames, nflGames] = await response.json()
      setAllCFBGames(cfbGames)
      setAllNBAGames(nbaGames)
      setAllNFLGames(nflGames)
      setGamesObj(gameData)
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
    // getAllGames()
    getAllGameData()
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

  const handleGameChangeCFB = (event) => {
    console.log(event.target.value)
    setCurrentGame(event.target.value)
  }

  const handleGameChangeNBA = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NBA`
    console.log(`new nba game ${newGame}`)
    console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    setCurrentGame(newGame)
    setCurrentOverUnder(gamesObj[k].ou)
    setCurrentSpread(gamesObj[k].spread)
  }

  const handleGameChangeNFL = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NFL`
    console.log(`new nba game ${newGame}`)
    console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    setCurrentGame(newGame)
    setCurrentOverUnder(gamesObj[k].ou)
    setCurrentSpread(gamesObj[k].spread)
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
              <InputLabel id='demo-simple-select-label'>CFB Games</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={allCFBGames.includes(currentGame) ? currentGame : null}
                label='NBA Games'
                onChange={handleGameChangeCFB}
              >
                {allCFBGames.map((game) => {
                  return <MenuItem value={game}>{game}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: 210, margin: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>NBA Games</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={allNBAGames.includes(currentGame) ? currentGame : null}
                label='NBA Games'
                onChange={handleGameChangeNBA}
              >
                {allNBAGames.map((game) => {
                  return <MenuItem value={game}>{game}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: 210, margin: 4 }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>NFL Games</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={allNFLGames.includes(currentGame) ? currentGame : null}
                label='NBA Games'
                onChange={handleGameChangeNFL}
              >
                {allNFLGames.map((game) => {
                  return <MenuItem value={game}>{game}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div
          style={{
            textAlign: 'center',
            fontSize: '64px',
          }}
        >
          {currentGame}
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
