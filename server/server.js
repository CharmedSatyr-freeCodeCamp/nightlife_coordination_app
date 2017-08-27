'use strict'

/*** NIGHTLIFE COORDINATION APP ***/
/*
User Story: As an unauthenticated user, I can view all bars in my area. ---DONE
User Story: As an authenticated user, I can add myself to a bar to indicate I am going there tonight. ---DONE
User Story: As an authenticated user, I can remove myself from a bar if I no longer want to go there. ---DONE
User Story: As an unauthenticated user, when I login I should not have to search again... DONE
*/

/*** EXPRESS ***/
const express = require('express')
const app = express()
const session = require('express-session') //Should come before dotenv

/*** GENERAL TOOLS ***/
const path = process.cwd()
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan')
  app.use(morgan('dev'))
}
require('dotenv').load()

/*** VIEW ENGINE ***/
app.set('view engine', 'html')
app.engine('html', (path, option, cb) => {})

/*** MIDDLEWARE ***/
app.use('/js', express.static(path + '/client/views/js')) //The first argument creates the virtual directory used in index.html
app.use('/img', express.static(path + '/client/views/img'))

/*** COMPRESSION ***/
const compression = require('compression')
app.use(compression())

/*** MONGOOSE ***/
const mongoose = require('mongoose')
const db = mongoose.connection
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI, { useMongoClient: true }, (err, db) => {
  if (err) {
    console.error('Database failed to connect!')
  } else {
    console.log('Connected to Mongo database.')
  }
})

/*** PASSPORT ***/
const passport = require('passport')
require('./app/config/passport')(passport)
app.use(
  session({
    secret: 'secretCharm',
    resave: false,
    saveUninitialized: true
  })
)
app.use(passport.initialize()) //Initiate passport authentication
app.use(passport.session()) //Persistent login sessions

/*** ROUTES ***/
const routes = require('./app/routes/index.js')
routes(app, passport)

/*** ERROR HANDLER ***/
app.use((err, req, res, next) => {
  res.status(err.status || 500)
})

/*** SERVE ***/
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log('Node.js listening on port', port + '.')
})
