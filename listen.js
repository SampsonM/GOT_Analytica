const app = require('./app.js')

app.listen(process.env.PORT || 6074, () => {  // <-- (process.env.PORT || 3000) 
  console.log('listening on PORT')
});
