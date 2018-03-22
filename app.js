const app = require('express')()
const bodyParser = require('body-parser')
const personalityRouter = require('./routes/personalityRouter')
const fs = require('fs')
const path = require('path')

app.use(bodyParser.json())

app.get('/', (res, req) => {
  console.log(path.join(__dirname + '/webPage/index.html'))
  res.render(path.join(__dirname + '/webPage/index.html'))
})

app.use('/GOTA', personalityRouter)

app.use('/*', (req, res, next) => {
  next({ status: 404 })
})
app.use((err, req, res, next) => {
  if (err.status === 404) return res.status(404).send({ msg: `page not found : err` })
  next(err)
})
app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'internal server error', err })
})


module.exports = app;
