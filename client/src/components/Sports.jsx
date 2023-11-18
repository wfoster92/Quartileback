import { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import csv from 'csvtojson'
import Spread from './Spread'
import OverUnder from './OverUnder'
import CasinoIcon from '@mui/icons-material/Casino'

const Sports = () => {
  const [data, setData] = useState(null)
  const [currentSpread, setCurrentSpread] = useState({})
  const [currentOverUnder, setCurrentOverUnder] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/cfb/ND/WAKE`)
        const result = await response.json()
        const { spread, overUnder } = result
        setCurrentOverUnder(overUnder)
        setCurrentSpread(spread)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }
  return (
    <>
      <div>
        <div style={{ textAlign: 'center', marginTop: '64px' }}>Spread</div>
        <div style={{ textAlign: 'center' }}>
          <Spread data={currentSpread} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '64px' }}>Over Under</div>
        <div style={{ textAlign: 'center' }}>
          <OverUnder data={currentOverUnder} />
        </div>
      </div>
    </>
  )
}

export default Sports
