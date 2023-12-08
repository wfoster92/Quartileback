import RankingsTableNCAAF from '../SubComponents/RankingsTableNCAAF'
import RankingsTableNCAAB from '../SubComponents/RankingsTableNCAAB'
import RankingsTableNBA from '../SubComponents/RankingsTableNBA'
import RankingsTableNFL from '../SubComponents/RankingsTableNFL'
import { useState, useEffect, useContext } from 'react'
import { GamesContext } from '../../contexts/GamesContext'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { TextField } from '@mui/material'

const Rankings = () => {
  const {
    loading,
    setLoading,
    error,
    setError,
    setRankingsTable,
    searchStrRankings,
    setSearchStrRankings,
    selectedRankingsTable,
    setSelectedRankingsTable,
    rankingsTables,
  } = useContext(GamesContext)

  const getRankingsTable = async () => {
    try {
      const response = await fetch(
        `/sports/getRankingsTable/${selectedRankingsTable}`
      )
      // const response = await fetch(`/sports/getRankingsTable/${selectedRankingsTable}`)
      const [tempRankingsTable] = await response.json()
      setRankingsTable(tempRankingsTable)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getRankingsTable()
  }, [selectedRankingsTable])

  const rankingsTablesObj = {
    nba: <RankingsTableNBA />,
    ncaab: <RankingsTableNCAAB />,
    ncaaf: <RankingsTableNCAAF />,
    nfl: <RankingsTableNFL />,
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Typography
          sx={{
            flex: '1 1 100%',
            fontWeight: '600',
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          Comprehensive Rankings
        </Typography>
        <div style={{ display: 'inline-block' }}>
          <ToggleButtonGroup
            value={selectedRankingsTable}
            color='primary'
            style={{ verticalAlign: 'middle' }}
          >
            {rankingsTables.map((elem) => {
              return (
                <ToggleButton
                  onClick={(e) => setSelectedRankingsTable(elem)}
                  value={elem}
                  sx={{
                    height: 56,
                    width: 56,
                    textTransform: 'none',
                    fontSize: '16px',
                  }}
                >
                  {elem}
                </ToggleButton>
              )
            })}
          </ToggleButtonGroup>
        </div>
        <div style={{ display: 'inline-block' }}>
          <TextField
            style={{ marginLeft: '32px' }}
            id='outlined-basic'
            label='Search'
            variant='outlined'
            value={searchStrRankings}
            onChange={(e) => setSearchStrRankings(e.target.value.toString())}
            InputLabelProps={{
              style: { zIndex: 0 },
            }}
          />
        </div>
      </div>

      {rankingsTablesObj[selectedRankingsTable]}
    </>
  )
}

export default Rankings
