import BestBetsTable from '../SubComponents/BestBetsTable'
import PortfolioTable from '../SubComponents/PortfolioTable'
import { useState, useEffect, useContext } from 'react'
import { GamesContext } from '../../contexts/GamesContext'

const Portfolio = () => {
  const { loading, setLoading, error, setError, setBestBetsTable } =
    useContext(GamesContext)
  const getBestBetsTable = async () => {
    try {
      const response = await fetch(`/sports/getBestBetsTable`)
      const [tempBestBetsTable] = await response.json()
      setBestBetsTable(tempBestBetsTable)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getBestBetsTable()
  }, [])
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }
  return (
    <>
      <PortfolioTable />
      <BestBetsTable />
    </>
  )
}

export default Portfolio
