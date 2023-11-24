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

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

app.use(bodyParser.urlencoded({ extended: true }))
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

app.get('/cfb/ouspread/:team1/:team2/', async (req, res) => {
  try {
    const { team1, team2 } = req.params

    // Print the current working directory
    console.log('Current working directory:', process.cwd())

    const futureGamesDir = path.join(process.cwd(), 'csvs', 'games', 'future')
    // Print the contents of the ./csvs/ directory
    const gamesDir = path.join(
      process.cwd(),
      'csvs',
      'games',
      fs.readdirSync(futureGamesDir).includes(`${team1}_vs_${team2}.csv`)
        ? 'future'
        : 'past'
    )

    console.log(`futureGamesDir ${futureGamesDir}`)
    console.log(path.join(futureGamesDir, `${team1}_vs_${team2}.csv`))

    console.log('Contents of ./csvs/ directory:', fs.readdirSync(gamesDir))

    let fname = path.join(gamesDir, `${team1}_vs_${team2}.csv`)
    console.log('Attempting to read:', fname)

    try {
      if (fs.existsSync(fname)) {
        let result = await csv().fromFile(fname)

        // get the home and away team from the filename
        const [home, away] = fname.split('/').pop().split('.')[0].split('_vs_')
        console.log(away, home)
        // initialize dictionaries for overUnder and spread
        let overUnder = {}
        let spread = {}
        // for each row in the csv take the sum for the over under and the diff for the spread
        // -> add them to their respective dictionaries
        result.forEach((row) => {
          let diff = Number(row[home]) - Number(row[away])
          let sum = Number(row[home]) + Number(row[away])
          // if the key exists  in the dictionary, add the probability to its current value, else create a new key value pair
          if (spread[diff]) {
            spread[diff] += Number(row.probability)
          } else {
            spread[diff] = Number(row.probability)
          }
          if (overUnder[sum]) {
            overUnder[sum] += Number(row.probability)
          } else {
            overUnder[sum] = Number(row.probability)
          }
        })
        console.log(`Spread\n${JSON.stringify(spread, null, 2)}`)
        res.json({ spread, overUnder }) // Send the JSON data as the response
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

// fetch the current bets for the game in question
app.get('/cfb/bets/:team1/:team2', async (req, res) => {
  try {
    const { team1, team2 } = req.params

    // Print the current working directory
    console.log('Current working directory:', process.cwd())

    // Print the contents of the ./csvs/ directory
    const gamesDir = path.join(process.cwd(), 'csvs', 'bets')

    let fname = path.join(gamesDir, `betoddsCurrent.csv`)
    console.log('Attempting to read:', fname)

    try {
      if (fs.existsSync(fname)) {
        console.log('hello')
        let result = await csv().fromFile(fname)
        let row = result.filter((row) => {
          console.log(row.homeTeamAbbrev, row.awayTeamAbbrev, team1, team2)
          return (
            [team1, team2].includes(row.homeTeamAbbrev) &&
            [team1, team2].includes(row.awayTeamAbbrev)
          )
        })
        if (row.length === 1) {
          row = row[0]
        }
        console.log(row)
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

app.get('/cfb/getAllGames', async (req, res) => {
  const pastGamesDir = path.join(process.cwd(), 'csvs', 'games', 'past')
  const futureGamesDir = path.join(process.cwd(), 'csvs', 'games', 'future')
  // console.log('Contents of ./csvs/ directory:', fs.readdirSync(gamesDir))
  const pastGameFiles = fs.readdirSync(pastGamesDir)
  const futureGameFiles = fs.readdirSync(futureGamesDir)
  const pastGames = pastGameFiles.map((game) => {
    return game.split('.')[0].replace('_vs_', ' vs ')
  })
  const futureGames = futureGameFiles.map((game) => {
    return game.split('.')[0].replace('_vs_', ' vs ')
  })
  res.json([pastGames, futureGames])
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
