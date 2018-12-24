const express = require('express');
const bodyParser = require('body-parser')
const cors = require('./cors')
const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json())
server.use(cors)

const port = process.env.PORT || 3001
server.listen(port, err => {
  console.log(`Api is run on ${port}`)
})

module.exports = server

