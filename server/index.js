// server/index.js

const express = require('express')
const fs = require('fs')
const csv = require('csvtojson')
const path = require('path')

const PORT = process.env.PORT || 3001

const app = express()

// let conferenceRatingsFile = './csvs/ND_vs_WAKE.csv'

app.get('/cfb/:team1/:team2', async (req, res) => {
  try {
    const { team1, team2 } = req.params

    // Print the current working directory
    console.log('Current working directory:', process.cwd())

    // Print the contents of the ./csvs/ directory
    const gamesDir = path.join(process.cwd(), 'csvs', 'games')
    console.log('Contents of ./csvs/ directory:', fs.readdirSync(gamesDir))

    let fname = path.join(gamesDir, `${team1}_vs_${team2}.csv`)
    console.log('Attempting to read:', fname)

    try {
      if (fs.existsSync(fname)) {
        let result = await csv().fromFile(fname)
        console.log('CSV data:', result)
        // get the home and away team from the filename
        const [away, home] = fname.split('/').pop().split('.')[0].split('_vs_')
        console.log(away, home)
        let overUnder = {}
        let spread = {}
        result.forEach((row) => {
          // console.log(JSON.stringify(row))
          let diff = Number(row[home]) - Number(row[away])
          let sum = Number(row[home]) + Number(row[away])
          // console.log(diff, sum)
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

app.get('/cfb/getAllGames', async (req, res) => {
  const gamesDir = path.join(process.cwd(), 'csvs', 'games')
  // console.log('Contents of ./csvs/ directory:', fs.readdirSync(gamesDir))
  const gameFiles = fs.readdirSync(gamesDir)
  const games = gameFiles.map((game) => {
    return game.split('.')[0].replace('_vs_', ' vs ')
  })
  // console.log(games)
  res.json(games)
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
