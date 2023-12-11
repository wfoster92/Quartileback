// server/index.js

const express = require('express')
const fs = require('fs')
const csv = require('csvtojson')
const path = require('path')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const cors = require('cors')

const PORT = process.env.PORT || 3001

const app = express()

let now = new Date()
let day = now.getDate()
let month = now.getMonth() + 1
let year = now.getFullYear()
let dateStr = `${month}_${day}_${year}`
console.log(`today's date is ${dateStr}`)
// hardcoded for the moment
dateStr = '12_10_2023'

app.use(express.static('../client/build'))
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

// Enable session cookies
app.use(
  cookieSession({
    name: 'session',
    keys: ['your-secret-key'], // Change this to a secret key for security
    maxAge: 24 * 60 * 60 * 1000, // Session duration (24 hours in milliseconds)
  })
)

// Sample user data (replace with database in production)
const users = [
  { username: 'ws', password: 'nc' },
  // { username: 'nc', password: 'nc' },
]

// Middleware to check authentication
const authenticate = (req, res, next) => {
  const { username, password } = req.body
  const user = users.find(
    (u) => u.username === username && u.password === password
  )

  if (user) {
    req.session.user = user // Store user information in the session

    next()
  } else {
    res.status(401).send('Unauthorized')
  }
}

// Login route
app.post('/login', authenticate, (req, res) => {
  res.send('Login successful!')
})

// fetch the current bets for the game in question
app.get('/sports/bets/:away/:home', async (req, res) => {
  try {
    const { away, home } = req.params

    // Print the current working directory

    // Print the contents of the ./csvs/ directory
    const gamesDir = path.join(process.cwd(), 'csvs', 'bet_odds')

    let fname = path.join(gamesDir, `betodds_${dateStr}.csv`)
    console.log('Attempting to read:', fname)

    try {
      if (fs.existsSync(fname)) {
        // console.log('hello')
        let result = await csv().fromFile(fname)
        let row = result.filter((row) => {
          // console.log(row.homeTeamAbbrev, row.awayTeamAbbrev, away, home)
          return (
            [away, home].includes(row.homeTeamAbbrev) &&
            [away, home].includes(row.awayTeamAbbrev)
          )
        })
        if (row.length === 1) {
          row = row[0]
        }
        res.json(row) // Send the JSON data as the response
      } else {
        throw new Error(`CSV file not found: ${fname}`)
      }
    } catch (error) {
      console.error('Error reading CSV file:', error)
      res.status(404).json({ error: 'CSV file not found' })
      return
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/sports/getBestBetsTable', async (req, res) => {
  const bestBetsDir = path.join(process.cwd(), 'csvs', 'best_bets')
  let fname = path.join(bestBetsDir, `bestbets_${dateStr}.csv`)
  try {
    if (fs.existsSync(fname)) {
      let result = await csv().fromFile(fname)
      let output = result.map((row) => {
        row = { ...row, inPortfolio: false, wager: 0, expectedReturn: 0 }
        return row
      })
      console.log(JSON.stringify(output, null, 2))
      res.json([output]) // Send the JSON data as the response
    } else {
      throw new Error(`CSV file not found: ${fname}`)
    }
  } catch (error) {
    console.error('Error reading CSV file:', error)
    res.status(404).json({ error: 'CSV file not found' })
    return
  }
})

app.get('/sports/getRankingsTable/:sport', async (req, res) => {
  const { sport } = req.params

  const rankingsDir = path.join(
    process.cwd(),
    'csvs',
    'comprehensive_rankings',
    sport
  )
  let fname = path.join(rankingsDir, `comprehensive_rankings_${sport}.csv`)
  try {
    if (fs.existsSync(fname)) {
      let result = await csv().fromFile(fname)
      res.json([result]) // Send the JSON data as the response
    } else {
      throw new Error(`CSV file not found: ${fname}`)
    }
  } catch (error) {
    console.error('Error reading CSV file:', error)
    res.status(404).json({ error: 'CSV file not found' })
    return
  }
})

app.get('/sports/getAllDatasets', async (req, res) => {
  const scoreSummariesDir = path.join(process.cwd(), 'csvs', 'score_summaries')
  let fname = path.join(scoreSummariesDir, `score_summaries_${dateStr}.csv`)
  try {
    if (fs.existsSync(fname)) {
      let result = await csv().fromFile(fname)
      let ncaafGames = []
      let ncaabGames = []
      let nbaGames = []
      let nflGames = []
      // initialize dictionaries for overUnder and spread
      let output = {}
      // for each row in the csv take the sum for the over under and the diff for the spread
      // -> add them to their respective dictionaries
      result.forEach((row) => {
        let { awayScore, homeScore, probability, awayTeam, homeTeam, sport } =
          row
        let k = `${awayTeam}_${homeTeam}_${sport}`
        awayScore = Number(awayScore)
        homeScore = Number(homeScore)

        probability = Number(probability)
        let diff = homeScore - awayScore
        let sum = homeScore + awayScore
        if (Object.keys(output).includes(k)) {
          let tempObj = output[k]

          if (tempObj.spread[`${diff}`]) {
            tempObj.spread[`${diff}`] += probability
          } else {
            tempObj.spread[`${diff}`] = probability
          }
          if (tempObj.ou[`${sum}`]) {
            tempObj.ou[`${sum}`] += probability
          } else {
            tempObj.ou[`${sum}`] = probability
          }
        } else {
          let tempObj = {
            spread: {},
            ou: {},
          }
          tempObj.spread[`${diff}`] = probability
          tempObj.ou[`${sum}`] = probability
          output[k] = tempObj
          if (sport === 'NFL') {
            nflGames.push(`${awayTeam} ${homeTeam}`)
          } else if (sport === 'NBA') {
            nbaGames.push(`${awayTeam} ${homeTeam}`)
          } else if (sport === 'NCAAF') {
            ncaafGames.push(`${awayTeam} ${homeTeam}`)
          } else if (sport === 'NCAAB') {
            ncaabGames.push(`${awayTeam} ${homeTeam}`)
          }
        }
      })
      // console.log(`Output\n${JSON.stringify(ncaabGames, null, 2)}`)
      ncaabGames.sort((a, b) => a.localeCompare(b))
      ncaafGames.sort((a, b) => a.localeCompare(b))
      nbaGames.sort((a, b) => a.localeCompare(b))
      nflGames.sort((a, b) => a.localeCompare(b))
      res.json([output, ncaafGames, ncaabGames, nbaGames, nflGames]) // Send the JSON data as the response
    } else {
      throw new Error(`CSV file not found: ${fname}`)
    }
  } catch (error) {
    console.error('Error reading CSV file:', error)
    res.status(404).json({ error: 'CSV file not found' })
    return
  }
})

// fetch the current bets for the game in question
app.post('/sports/heatmap/', async (req, res) => {
  console.log('hello')
  try {
    const { away, home } = req.body
    console.log('Request Body:', req.body)

    const scoreSummariesDir = path.join(
      process.cwd(),
      'csvs',
      'score_summaries'
    )
    let fname = path.join(scoreSummariesDir, `score_summaries_${dateStr}.csv`)
    console.log('Attempting to read:', fname)

    if (fs.existsSync(fname)) {
      let result = await csv().fromFile(fname)

      // initialize dictionaries for overUnder and spread
      // let output = {}
      // for each row in the csv take the sum for the over under and the diff for the spread
      // -> add them to their respective dictionaries
      let output = result
        .filter((row) => row.homeTeam === home && row.awayTeam === away)
        .map((elem) => elem)

      console.log(JSON.stringify(output, null, 2))
      res.json([output]) // Send the JSON data as the response
    } else {
      throw new Error(`CSV file not found: ${fname}`)
    }
  } catch (error) {
    console.error('Error reading CSV file:', error)
    res.status(404).json({ error: 'CSV file not found' })
    return
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
