const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const auth = require('./auth')
const todos = require('./todos')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/auth', auth)
app.use('/api', todos)

app.listen(3000, () => {
  console.log(`Server is running on 3000`)
})
