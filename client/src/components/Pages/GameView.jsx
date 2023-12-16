import { useState, useEffect, useContext, useCallback } from 'react'
import { GamesContext } from '../../contexts/GamesContext'
import styled from '@emotion/styled'
import csv from 'csvtojson'
import Spread from '../SubComponents/Spread'
import OverUnder from '../SubComponents/OverUnder'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Grid } from '@mui/material'
import HeatmapContainer from '../SubComponents/HeatmapContainer'

const GameView = () => {
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
    allNCAABGames,
    setAllNCAABGames,
    gamesObj,
    setGamesObj,
    setHeatmapData,
    selectedSport,
    setSelectedSport,
  } = useContext(GamesContext)

  const Title = styled.div`
    font-size: '50px';
    margin: '10vh 0';
    text-align: center;
  `
  const fetchSingleGameData = async () => {
    if (currentGame.length > 0) {
      const [away, home] = currentGame.split(' ')
      try {
        const response = await fetch(`/sports/bets/${away}/${home}`)
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

  const fetchHeatmapData = async () => {
    if (currentGame.length > 0) {
      const [awayTeam, homeTeam] = currentGame.split(' ')
      console.log(awayTeam, homeTeam)
      try {
        const response = await fetch('/sports/heatmap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Adjust the content type if necessary
            // Add any other headers as needed
          },
          body: JSON.stringify({
            away: awayTeam,
            home: homeTeam,
            // sport: sport,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`)
        }

        const [data] = await response.json()
        setHeatmapData(data)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
  }

  const getAllGameData = async () => {
    try {
      const response = await fetch(`/sports/getAllDatasets`)
      const [gameData, cfbGames, ncaabGames, nbaGames, nflGames] =
        await response.json()
      console.log(`ncaab games ${ncaabGames}`)
      setAllCFBGames(cfbGames)
      setAllNCAABGames(ncaabGames)
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
    getAllGameData()
  }, [])

  useEffect(() => {
    fetchSingleGameData()
    fetchHeatmapData()
  }, [currentGame])

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
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NCAAF`
    console.log(`new cfb game ${newGame}`)
    console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    setCurrentGame(newGame)
    setCurrentOverUnder(gamesObj[k].ou)
    setCurrentSpread(gamesObj[k].spread)
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

  const handleGameChangeNCAAB = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NCAAB`
    // console.log(`new ncaab game ${newGame}`)
    // console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    setCurrentGame(newGame)
    setCurrentOverUnder(gamesObj[k].ou)
    setCurrentSpread(gamesObj[k].spread)
  }

  const handleGameChangeNFL = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NFL`
    console.log(`new nfl game ${newGame}`)
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
        <div style={{ height: '2vh' }}></div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2vw',
          }}
        >
          <Box style={{ width: '24vh', margin: '0' }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>NCAAB</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={allNCAABGames.includes(currentGame) ? currentGame : null}
                label='NCAAB'
                onChange={handleGameChangeNCAAB}
              >
                {allNCAABGames.map((game) => {
                  return <MenuItem value={game}>{game}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Box>
          <Box style={{ width: '24vh', margin: '0' }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>CFB</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={allCFBGames.includes(currentGame) ? currentGame : null}
                label='CFB'
                onChange={handleGameChangeCFB}
              >
                {allCFBGames.map((game) => {
                  return <MenuItem value={game}>{game}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Box>
          <Box style={{ width: '24vh', margin: '0' }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>NBA</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={allNBAGames.includes(currentGame) ? currentGame : null}
                label='NBA'
                onChange={handleGameChangeNBA}
              >
                {allNBAGames.map((game) => {
                  return <MenuItem value={game}>{game}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Box>
          <Box style={{ width: '24vh', margin: '0' }}>
            <FormControl fullWidth>
              <InputLabel id='demo-simple-select-label'>NFL</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={allNFLGames.includes(currentGame) ? currentGame : null}
                label='NFL'
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
            marginTop: '2vh',
            fontSize: '4vh',
          }}
        >
          {currentGame.replace(' ', ' vs. ')}
        </div>
        {currentGame ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  md={5.5}
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    margin: '2vw',
                  }}
                >
                  <HeatmapContainer />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={5.5}
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    margin: '2vw',
                  }}
                >
                  <Spread />
                </Grid>
              </Grid>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  md={5.5}
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    margin: '2vw',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <OverUnder />
                  </div>
                </Grid>
              </Grid>
            </div>
          </>
        ) : (
          <>
            <div style={{ height: '2vh' }}></div>
            <Title style={{ fontSize: '3vh' }}>Please select a game.</Title>
            <img
              style={{
                borderRadius: '16px',
                margin: '2vh auto',
                display: 'block',
                width: `${viewportWidth * 0.5}px`,
                height: `${viewportWidth * 0.5 * (5 / 7)}px`,
              }}
              src={process.env.PUBLIC_URL + '/big_lebowski_dude.webp'}
            ></img>
          </>
        )}
      </div>
    </>
  )
}

export default GameView
