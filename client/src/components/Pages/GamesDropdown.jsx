const GamesDropdown = () => {
  const handleGameChangeCFB = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NCAAF`
    console.log(`new cfb game ${newGame}`)
    console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    setCurrentGame(newGame)
    setCurrentOverUnder(gamesObj[k].ou)
    setCurrentSpread(gamesObj[k].spread)
  }

  const handleGameChangeNBA = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NBA`
    console.log(`new nba game ${newGame}`)
    console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    setCurrentGame(newGame)
    setCurrentOverUnder(gamesObj[k].ou)
    setCurrentSpread(gamesObj[k].spread)
  }

  const handleGameChangeNCAAB = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NCAAB`
    // console.log(`new ncaab game ${newGame}`)
    // console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    setCurrentGame(newGame)
    setCurrentOverUnder(gamesObj[k].ou)
    setCurrentSpread(gamesObj[k].spread)
  }

  const handleGameChangeNFL = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NFL`
    console.log(`new nfl game ${newGame}`)
    console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    setCurrentGame(newGame)
    setCurrentOverUnder(gamesObj[k].ou)
    setCurrentSpread(gamesObj[k].spread)
  }

  const handleGameChangeNHL = (event) => {
    let newGame = event.target.value
    let [away, home] = newGame.split(' ')
    let k = `${away}_${home}_NHL`
    console.log(`new nhl game ${newGame}`)
    console.log(`gamesObj ${JSON.stringify(gamesObj[k])}`)
    setCurrentGame(newGame)
    setCurrentOverUnder(gamesObj[k].ou)
    setCurrentSpread(gamesObj[k].spread)
  }

  ;<>
    <div style={{ height: '2vh' }}></div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2vw',
      }}
    >
      <Box style={{ width: '24vh', margin: '0' }}>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>NCAAB</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={allNCAABGames.includes(currentGame) ? currentGame : null}
            label='NCAAB'
            onChange={handleGameChangeNCAAB}
          >
            {allNCAABGames.map((game) => {
              return <MenuItem value={game}>{game}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>
      <Box style={{ width: '24vh', margin: '0' }}>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>CFB</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={allCFBGames.includes(currentGame) ? currentGame : null}
            label='CFB'
            onChange={handleGameChangeCFB}
          >
            {allCFBGames.map((game) => {
              return <MenuItem value={game}>{game}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>
      <Box style={{ width: '24vh', margin: '0' }}>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>NBA</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={allNBAGames.includes(currentGame) ? currentGame : null}
            label='NBA'
            onChange={handleGameChangeNBA}
          >
            {allNBAGames.map((game) => {
              return <MenuItem value={game}>{game}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>
      <Box style={{ width: '24vh', margin: '0' }}>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>NFL</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={allNFLGames.includes(currentGame) ? currentGame : null}
            label='NFL'
            onChange={handleGameChangeNFL}
          >
            {allNFLGames.map((game) => {
              return <MenuItem value={game}>{game}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>
      <Box style={{ width: '24vh', margin: '0' }}>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>NFL</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={allNHLGames.includes(currentGame) ? currentGame : null}
            label='NFL'
            onChange={handleGameChangeNFL}
          >
            {allNHLGames.map((game) => {
              return <MenuItem value={game}>{game}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>
    </div>
  </>
}
export default GamesDropdown
