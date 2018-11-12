const express = require('express');
const bodyParser = require('body-parser')

//Routes
const usersRouter = require('./routes/users');
const vagasRouter = require('./routes/vagas')
const auth = require('./routes/auth')

const cors = require('./config/cors')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors)

app.use('/api', usersRouter, vagasRouter);
app.use('/api/auth',auth)

const port = process.env.PORT || 80
app.listen(port, err => {
  console.log(`Api is run on ${port}`)
})