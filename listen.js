const app = require('./app.js')

app.listen(process.env.PORT || 6074, () => {
  console.log('listening.....')
})
