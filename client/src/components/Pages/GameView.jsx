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
import { useLocation, useNavigate } from 'react-router-dom'

const GameView = () => {
  const {
    loading,
    setLoading,
    error,
    setError,

    viewportWidth,
    viewportHeight,
    setViewportWidth,
    setViewportHeight,

    allCFBGames,
    setAllCFBGames,
    allNBAGames,
    setAllNBAGames,
    allNFLGames,
    setAllNFLGames,
    allNCAABGames,
    setAllNCAABGames,
    setHeatmapData,
  } = useContext(GamesContext)

  const navigate = useNavigate()

  let tempSpreadObj = {
    currentSpread: null,
    spread: 0,
    spreadIsInt: true,
    fractionalSpread: false,
  }
  const [spreadObj, setSpreadObj] = useState(tempSpreadObj)

  let tempOverUnderObj = {
    currentOverUnder: null,
    OU: 0,
    ouIsInt: true,
    fractionalOU: false,
  }
  const [overUnderObj, setOverUnderObj] = useState(tempOverUnderObj)
  const [gamesObj, setGamesObj] = useState(null)
  const [currentGameInfo, setCurrentGameInfo] = useState(null)
  const [currentGame, setCurrentGame] = useState('')
  const [urlParams, setUrlParams] = useState(null)

  // const { homeTeam, awayTeam, sport } = useParams()
  // console.log(homeTeam, awayTeam, sport)

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const homeTeam = queryParams.get('homeTeam')
  const awayTeam = queryParams.get('awayTeam')
  const sport = queryParams.get('sport')

  console.log(homeTeam, awayTeam, sport)

  const fetchSingleGameData = async () => {
    if (homeTeam && awayTeam && sport) {
      try {
        const response = await fetch(`/sports/bets/${awayTeam}/${homeTeam}`)
        const tempGameInfo = await response.json()
        setCurrentGameInfo(tempGameInfo)
        let tempOU = Number(tempGameInfo.overUnder)
        let tempSpread = Number(tempGameInfo.gameLine)
        let k = `${awayTeam}_${homeTeam}_${sport}`

        let tempCurrentOverUnder = gamesObj?.[k]?.ou
        if (Number.isInteger(tempOU)) {
          setOverUnderObj({
            OU: tempOU,
            ouIsInt: true,
            fractionalOU: false,
            currentOverUnder: tempCurrentOverUnder,
          })
        } else {
          setOverUnderObj({
            OU: tempOU,
            ouIsInt: false,
            fractionalOU: true,
            currentOverUnder: tempCurrentOverUnder,
          })
        }
        let tempCurrentSpread = gamesObj?.[k]?.spread
        if (Number.isInteger(tempSpread)) {
          setSpreadObj({
            spread: tempSpread,
            spreadIsInt: true,
            fractionalSpread: false,
            currentSpread: tempCurrentSpread,
          })
        } else {
          setSpreadObj({
            spread: tempSpread,
            spreadIsInt: false,
            fractionalSpread: true,
            currentSpread: tempCurrentSpread,
          })
        }
        // setOU(Math.floor(tempOU))
        // setSpread(Math.floor(tempSpread))
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
  }

  // const fetchHeatmapData = async () => {
  //   if (currentGame.length > 0) {
  //     const [awayTeam, homeTeam] = currentGame.split(' ')
  //     console.log(awayTeam, homeTeam)
  //     try {
  //       const response = await fetch('/sports/heatmap', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json', // Adjust the content type if necessary
  //           // Add any other headers as needed
  //         },
  //         body: JSON.stringify({
  //           away: awayTeam,
  //           home: homeTeam,
  //           // sport: sport,
  //         }),
  //       })

  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch data. Status: ${response.status}`)
  //       }

  //       const [data] = await response.json()
  //       setHeatmapData(data)
  //     } catch (error) {
  //       setError(error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  // }

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
    setTimeout(() => {}, 500)
    const fetchData = async () => {
      try {
        await fetchSingleGameData()
        // fetchHeatmapData(); // Commented out for now
      } catch (error) {
        setError(error)
        setLoading(false)
      }
    }

    fetchData()
  }, [currentGame])

  useEffect(() => {
    console.log(homeTeam, awayTeam, sport)
    setUrlParams({ homeTeam, awayTeam, sport })

    const currentGameString = `${awayTeam} ${homeTeam}`

    if (currentGameString !== ' ') {
      getAllGameData()
      setCurrentGame(currentGameString)
    } else {
      // do nothing
      // getAllGameData();
    }
  }, [homeTeam, awayTeam, sport])

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth
    // console.log('New Viewport Width:', newWidth)
    setViewportWidth(newWidth)
    const newHeight = window.innerHeight
    setViewportHeight(newHeight)
  }, [urlParams])

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
    const homeTeamParam = encodeURIComponent(away)
    const awayTeamParam = encodeURIComponent(home)
    const sportParam = encodeURIComponent('NCAAF')

    const url = `/gameView?homeTeam=${homeTeamParam}&awayTeam=${awayTeamParam}&sport=${sportParam}`
    navigate(url)
  }

  const handleGameChangeNBA = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NBA`
    console.log(`new nba game ${newGame}`)
    const homeTeamParam = encodeURIComponent(away)
    const awayTeamParam = encodeURIComponent(home)
    const sportParam = encodeURIComponent('NBA')

    const url = `/gameView?homeTeam=${homeTeamParam}&awayTeam=${awayTeamParam}&sport=${sportParam}`
    navigate(url)
  }

  const handleGameChangeNCAAB = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NCAAB`
    // console.log(`new ncaab game ${newGame}`)
    const homeTeamParam = encodeURIComponent(away)
    const awayTeamParam = encodeURIComponent(home)
    const sportParam = encodeURIComponent('NCAAB')

    const url = `/gameView?homeTeam=${homeTeamParam}&awayTeam=${awayTeamParam}&sport=${sportParam}`
    navigate(url)
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
    navigate(url)
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
        <>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={1}>
              {/* <Grid
                item
                xs={12}
                md={5.5}
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  margin: '2vw',
                }}
              >
                <HeatmapContainer currentGame={currentGame} />
              </Grid> */}
              <Grid
                item
                xs={12}
                md={5.5}
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  margin: '2vw',
                }}
              >
                <Spread
                  currentGame={currentGame}
                  spreadObj={spreadObj}
                  setSpreadObj={setSpreadObj}
                />
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
                  <OverUnder
                    currentGame={currentGame}
                    overUnderObj={overUnderObj}
                    setOverUnderObj={setOverUnderObj}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        </>
      </div>
    </>
  )
}

export default GameView
