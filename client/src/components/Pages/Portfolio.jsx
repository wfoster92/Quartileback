import BetLegsTable from '../SubComponents/BetLegsTable'
import PortfolioTable from '../SubComponents/PortfolioTable'
import TableContainer from '../SubComponents/TableContainer'
import { useState, useEffect, useContext } from 'react'
import { GamesContext } from '../../contexts/GamesContext'
import PortfolioScatterplot from '../SubComponents/PortfolioScatterplot'
import { FormGroup, FormControlLabel, Switch, Button } from '@mui/material'

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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'inline-block' }}>
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
        </div>
        {betLegsTable.filter((elem) => elem.inParlay).length > 1 ? (
          <Button style={{ display: 'inline-block', height: '38' }}>
            Add Parlay
          </Button>
        ) : null}
      </div>
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
