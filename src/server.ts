import app from './app'
const port = process.env.PORT

app.listen(port, () => {
  console.log(`RIS-API listening on port ${port}`)
})
