import BetLegsTable from '../SubComponents/BetLegsTable'
import PortfolioTable from '../SubComponents/PortfolioTable'
import TableContainer from '../SubComponents/TableContainer'
import { useState, useEffect, useContext } from 'react'
import { GamesContext } from '../../contexts/GamesContext'
import PortfolioScatterplot from '../SubComponents/PortfolioScatterplot'

const Portfolio = () => {
  const { loading, setLoading, error, setError, setBetLegsTable } =
    useContext(GamesContext)
  const getBetLegsTable = async () => {
    try {
      const response = await fetch(`/sports/getBetLegsTable`)
      const [tempBetLegsTable] = await response.json()
      setBetLegsTable(tempBetLegsTable)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getBetLegsTable()
  }, [])
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }
  return (
    <>
      <PortfolioScatterplot />
      <TableContainer TableComponent={PortfolioTable} title='Portfolio' />
      <TableContainer TableComponent={BetLegsTable} title='Bet Legs' />
      {/* <PortfolioTable /> */}
      {/* <BetLegsTable /> */}
    </>
  )
}

export default Portfolio
