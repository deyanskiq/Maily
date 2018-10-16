const express = require('express')
const app = express()
require('dotenv').config()

app.get('/', (req, res) => {
  res.send({ hi: 'there' })
})

app.listen(process.env.PORT || 5000)