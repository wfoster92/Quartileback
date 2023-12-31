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

  function americanToDecimal(americanOdds) {
    if (americanOdds > 0) {
      return americanOdds / 100 + 1
    } else if (americanOdds < 0) {
      return 100 / Math.abs(americanOdds) + 1
    }
    return 1 // Return 1 for even odds (American format: ±100)
  }

  function calculateParlayOdds(oddsArray) {
    // Convert American odds to decimal odds
    const decimalOddsArray = oddsArray.map(americanToDecimal)

    // Calculate the parlay odds
    const totalDecimalOdds = decimalOddsArray.reduce(
      (accumulator, odds) => accumulator * odds,
      1
    )
    const parlayOdds = (totalDecimalOdds - 1) * 100

    return parlayOdds
  }

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
          <Button
            style={{ display: 'inline-block', height: '38' }}
            onClick={() => {
              let legs = betLegsTable.filter((elem) => elem.inParlay)

              let probability = legs
                .map((elem) => elem.probability)
                .reduce((a, b) => a * b)
              let odds = calculateParlayOdds(
                legs.map((elem) => Number(elem.odds))
              )

              let parlay = {
                index: 'parlay',
                probability: probability,
                odds: odds,
                inPortfolio: true,
                inParlay: false,
                dataType: 'float',
                align: 'right',
                kelly: '(0, 1)',
              }
              console.log('parlay', JSON.stringify(parlay))
              setBetLegsTable((prevState) => [
                ...prevState.map((elem) => {
                  return { ...elem, inParlay: false }
                }),
                parlay,
              ])
            }}
          >
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
