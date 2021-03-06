require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const logsRouter = require('./logs/logs-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./auth/user-router');

const {NODE_ENV} = require('./config');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

// POSY endpoints

app.use('/api/logs', logsRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

app.get('/', (req, res) =>{
    res.send('Hello, world!');
})

app.use(function errorHandler(error, req, res, next){
    let response
    if(NODE_ENV === 'production'){
        response = {error: {message: 'server error'}}
    } else {
        console.log(error);
        response = {message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app;