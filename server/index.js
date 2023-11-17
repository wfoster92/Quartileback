// server/index.js

const express = require('express')
const fs = require('fs')
const csv = require('csvtojson')

const PORT = process.env.PORT || 3001

const app = express()

let conferenceRatingsFile = './csvs/ND_vs_WAKE.csv'

app.get('/api', async (req, res) => {
  try {
    let result = await csv()
      .fromFile(conferenceRatingsFile)
      .then((data) => {
        // get the home and away team from the filename
        const [home, away] = conferenceRatingsFile
          .split('/')
          .pop()
          .split('.')[0]
          .split('_vs_')
        console.log(home, away)
        let overUnder = {}
        let spread = {}
        data.forEach((row) => {
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
        console.log(JSON.stringify(overUnder, null, 2))
        console.log(JSON.stringify(spread, null, 2))
        return { spread: spread, overUnder: overUnder } // return the JSON data
      })

    res.json(result) // send the JSON data as the response
  } catch (error) {
    console.error('Error reading CSV file:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
