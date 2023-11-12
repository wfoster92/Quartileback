// server/index.js

const express = require('express')
const fs = require('fs')
const csv = require('csvtojson')

const PORT = process.env.PORT || 3001

const app = express()

let conferenceRatingsFile = './csvs/conference_ratings_2023-11-04.csv'

app.get('/api', async (req, res) => {
  try {
    let result = await csv()
      .fromFile(conferenceRatingsFile)
      .then((jsonObj) => {
        console.log(jsonObj)
        return jsonObj // return the JSON data
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
