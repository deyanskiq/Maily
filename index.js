const express = require('express')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const cookieSession = require('cookie-session')
const passport = require('passport')

require('dotenv').config()
require('./models/User')
require('./services/passport')
mongoose.connect(keys.mongoURI)

const app = express()

require('./routes/authRoutes')(app)


app.listen(process.env.PORT || 5000)