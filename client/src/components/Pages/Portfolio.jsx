import BetLegsTable from '../SubComponents/BetLegsTable'
import PortfolioTable from '../SubComponents/PortfolioTable'
import TableContainer from '../SubComponents/TableContainer'
import { useState, useEffect, useContext } from 'react'
import { GamesContext } from '../../contexts/GamesContext'
import PortfolioScatterplot from '../SubComponents/PortfolioScatterplot'
import { FormGroup, FormControlLabel, Switch } from '@mui/material'

const Portfolio = () => {
  const {
    loading,
    setLoading,
    error,
    setError,
    betLegsTable,
    setBetLegsTable,
  } = useContext(GamesContext)

  const [showChart, setShowChart] = useState(false)

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
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              value={showChart}
              onChange={() => setShowChart((prevState) => !prevState)}
            />
          }
          label='Chart'
        />
      </FormGroup>
      {betLegsTable.filter((elem) => elem.inPortfolio).length > 0 &&
      showChart ? (
        <PortfolioScatterplot />
      ) : null}
      {/* <PortfolioScatterplot /> */}
      <TableContainer TableComponent={PortfolioTable} title='Portfolio' />
      <TableContainer TableComponent={BetLegsTable} title='Bet Legs' />
      {/* <PortfolioTable /> */}
      {/* <BetLegsTable /> */}
    </>
  )
}

export default Portfolio
