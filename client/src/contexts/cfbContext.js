// CFBContext.js
import React, { createContext, useContext, useState } from 'react'

const CFBContext = createContext()

const CFBProvider = ({ children }) => {
  const [currentSpread, setCurrentSpread] = useState({})
  const [currentOverUnder, setCurrentOverUnder] = useState({})
  const [currentGameInfo, setCurrentGameInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allPastGames, setAllPastGames] = useState([])
  const [allFutureGames, setAllFutureGames] = useState([])
  const [currentGame, setCurrentGame] = useState('')
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
  const [spread, setSpread] = useState(0)
  const [OU, setOU] = useState(0)
  const [ouIsInt, setOuIsInt] = useState(true)
  const [spreadIsInt, setSpreadIsInt] = useState(true)
  const [fractionalOU, setFractionalOU] = useState(false)
  const [fractionalSpread, setFractionalSpread] = useState(false)

  const [allCFBGames, setAllCFBGames] = useState([])
  const [allNBAGames, setAllNBAGames] = useState([])
  const [allNFLGames, setAllNFLGames] = useState([])
  const [gamesObj, setGamesObj] = useState(null)

  const state = {
    currentSpread,
    setCurrentSpread,
    currentOverUnder,
    setCurrentOverUnder,
    currentGameInfo,
    setCurrentGameInfo,
    loading,
    setLoading,
    error,
    setError,
    allPastGames,
    setAllPastGames,
    allFutureGames,
    setAllFutureGames,
    currentGame,
    setCurrentGame,
    viewportWidth,
    setViewportWidth,
    spread,
    setSpread,
    OU,
    setOU,
    ouIsInt,
    setOuIsInt,
    spreadIsInt,
    setSpreadIsInt,
    fractionalOU,
    setFractionalOU,
    fractionalSpread,
    setFractionalSpread,
    allCFBGames,
    setAllCFBGames,
    allNBAGames,
    setAllNBAGames,
    allNFLGames,
    setAllNFLGames,
    gamesObj,
    setGamesObj,
  }

  return <CFBContext.Provider value={state}>{children}</CFBContext.Provider>
}

export { CFBProvider, CFBContext }
