import RankingsTable from '../SubComponents/RankingsTable'
import { useState, useEffect, useContext } from 'react'
import { GamesContext } from '../../contexts/GamesContext'

const Rankings = () => {
  const { loading, setLoading, error, setError, setRankingsTable } =
    useContext(GamesContext)
  const getRankingsTable = async () => {
    try {
      const response = await fetch(`/sports/getRankingsTable`)
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
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <>
      <RankingsTable />
    </>
  )
}

export default Rankings
