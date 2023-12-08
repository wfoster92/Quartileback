import { useState, useEffect } from 'react'
import styled from '@emotion/styled'

import CasinoIcon from '@mui/icons-material/Casino'
import { Button } from '@mui/material'

const CenterDiv = styled.div`
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Home = () => {
  const [d1, setD1] = useState(Math.floor(Math.random() * 6 + 1))
  const [d2, setD2] = useState(Math.floor(Math.random() * 6 + 1))

  const [message, setMessage] = useState('')

  const [money, setMoney] = useState(Math.floor(Math.random() * 100))
  const [highScore, setHighScore] = useState(money)
  const [overall, setOverall] = useState(-money)

  const rollsDice = () => {
    let tempD1 = Math.floor(Math.random() * 6 + 1)
    setD1(tempD1)
    let tempD2 = Math.floor(Math.random() * 6 + 1)
    setD2(tempD2)
    let sum = tempD1 + tempD2
    if ([2, 3, 12].includes(sum)) {
      setMoney(0)
      setMessage('Out of luck bud')
    } else if ([7, 11].includes(sum)) {
      setMoney(money * 2)
      setMessage("You're in the money - Doublin Up!")
    } else {
      setMessage('Break even')
    }
  }

  const reset = () => {
    let start = Math.floor(Math.random() * 100)
    setMoney(start)
    setOverall(overall - start)
  }

  const cashOut = () => {
    setOverall(overall + money)
    setMoney(0)
  }

  useEffect(() => {
    if (overall > highScore) {
      setHighScore(Math.max(overall, money))
    }
  }, [money, overall])

  return (
    <CenterDiv>
      <h1>Roll that dice brother</h1>
      <CasinoIcon
        style={{ height: '64px', width: '64px' }}
        onClick={rollsDice}
      />
      <CasinoIcon
        style={{ height: '64px', width: '64px' }}
        onClick={rollsDice}
      />
      <h2>
        {d1} + {d2} = {d1 + d2} {message}
      </h2>

      <h2>On table ${money}</h2>
      <h2>High Score: ${highScore}</h2>
      <h2>Bank ${overall}</h2>

      <div style={{ display: 'inline-block' }}>
        <Button onClick={reset}>Fresh Bet</Button>
      </div>
      <div style={{ display: 'inline-block' }}>
        <Button onClick={cashOut}>Cash Out</Button>
      </div>
    </CenterDiv>
  )
}

export default Home
