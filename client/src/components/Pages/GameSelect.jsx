import { useState, useEffect, useContext, useCallback } from 'react'
import { GamesContext } from '../../contexts/GamesContext'
import { useAuth } from '../../contexts/AuthContext'
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
import { useParams, useNavigate } from 'react-router-dom'

const GameSelect = () => {
  const {
    loading,
    setLoading,
    error,
    setError,
    currentGame,
    setCurrentGame,
    viewportWidth,
    viewportHeight,
    setViewportWidth,
    setViewportHeight,
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

  const { authToken } = useAuth() // Get authentication state and logout function

  const Title = styled.div`
    font-size: '50px';
    margin: '10vh 0';
    text-align: center;
  `

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth
    // console.log('New Viewport Width:', newWidth)
    setViewportWidth(newWidth)
    const newHeight = window.innerHeight
    setViewportHeight(newHeight)
  }, [])

  // useEffect(() => {
  //   console.log('hello')
  //   window.addEventListener('resize', handleResize, false)
  //   return () => window.removeEventListener('resize', handleResize, false)
  // }, [handleResize])

  useEffect(() => {
    setTimeout(() => {
      window.addEventListener('resize', handleResize, false)
      return () => window.removeEventListener('resize', handleResize, false)
    }, 100)
  }, [handleResize])

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
      // setGamesObj(gameData)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const navigate = useNavigate()

  useEffect(() => {
    getAllGameData()
  }, [])

  const handleGameChangeCFB = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NCAAF`
    console.log(`new cfb game ${newGame}`)
    // console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    const homeTeamParam = encodeURIComponent(away)
    const awayTeamParam = encodeURIComponent(home)
    const sportParam = encodeURIComponent('NCAAF')

    const url = `/gameView?homeTeam=${homeTeamParam}&awayTeam=${awayTeamParam}&sport=${sportParam}`
    window.open(url, '_blank')
  }

  const handleGameChangeNBA = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NBA`
    console.log(`new nba game ${newGame}`)
    // console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    const homeTeamParam = encodeURIComponent(away)
    const awayTeamParam = encodeURIComponent(home)
    const sportParam = encodeURIComponent('NBA')

    const url = `/gameView?homeTeam=${homeTeamParam}&awayTeam=${awayTeamParam}&sport=${sportParam}`
    window.open(url, '_blank')
  }

  const handleGameChangeNCAAB = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NCAAB`
    // console.log(`new ncaab game ${newGame}`)
    // console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    const homeTeamParam = encodeURIComponent(away)
    const awayTeamParam = encodeURIComponent(home)
    const sportParam = encodeURIComponent('NCAAB')

    const url = `/gameView?homeTeam=${homeTeamParam}&awayTeam=${awayTeamParam}&sport=${sportParam}`
    window.open(url, '_blank')
  }

  const handleGameChangeNFL = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NFL`
    console.log(`new nfl game ${newGame}`)
    const homeTeamParam = encodeURIComponent(away)
    const awayTeamParam = encodeURIComponent(home)
    const sportParam = encodeURIComponent('NFL')

    const url = `/gameView?homeTeam=${homeTeamParam}&awayTeam=${awayTeamParam}&sport=${sportParam}`
    window.open(url, '_blank')
  }

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }

  // Redirect to login page if not authenticated
  if (!authToken) {
    // You can use React Router or any other navigation method here
    navigate('/login')
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

        <>
          <div style={{ height: '2vh' }}></div>
          <Title style={{ fontSize: '3vh' }}>Please select a game.</Title>
          <img
            style={{
              borderRadius: '16px',
              margin: '2vh auto',
              display: 'block',
              width: `70${viewportWidth > viewportHeight ? 'vh' : 'vw'}`,
              height: `70${viewportWidth > viewportHeight ? 'vh' : 'vw'}`,
            }}
            src={process.env.PUBLIC_URL + '/armchair1.png'}
          ></img>
        </>
      </div>
    </>
  )
}

export default GameSelect
