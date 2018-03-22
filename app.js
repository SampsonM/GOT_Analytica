const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
  const {
    getCharacterInfo
} = require('./controllers/personalityController')
const path = require('path')

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'views')))

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('index.ejs');
})

app.get('/:twit_name', getCharacterInfo)

app.use('/*', (req, res, next) => {
  next({ status: 404 })
})
app.use((err, req, res, next) => {
  if (err.status === 404) return res.status(404).send({ msg: `page not found : err` })
  next(err)
})
app.use((err, req, res, next) => {
  console.log(err)
  res.render('wrong.ejs')
  res.status(500).send({ msg: 'internal server error', err })
})

module.exports = app;
