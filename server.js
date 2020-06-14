require('dotenv').config({path: __dirname + '/.env'})
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var morgan = require('morgan');

//authorization
var jwt = require('jsonwebtoken');
var auth = require('./config/Auth');
//database
const InitiateMongoServer = require("./config/db");

app.use(express.static(__dirname));
app.use(bodyParser.json({limit: "50mb"}));
// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({limit: "50mbs", extended: true, parameterLimit:50000}));

//mongo DB connection
InitiateMongoServer();

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

//socket
var io = require('socket.io')(http);
var socket = require('./config/socket');
socket.listen(io)

//routes
require('./routes/MessageRoute.js')(app, io);
require('./routes/UserRoute.js')(app);


//server connection
const port = process.env.PORT || 3001;
var server = http.listen(port, () => {
  console.log('server is running on port', server.address().port);
});
