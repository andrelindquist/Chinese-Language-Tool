//BASE SETUP
//=====================

//CALL THE PACKAGES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var path = require('path');

//APP CONFIGURATION
//use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure our app to handle cors requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

//log all responses to the console
app.use(morgan('dev'));

//connect to our database
mongoose.connect(config.database);

//set static files location
app.use(express.static(__dirname + '/public'));

//Routes for our API
//====================
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

//Main catchall route
//send users to frontend
//has to be registered after API Routes
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//Start the server
//======================
app.listen(config.port);
console.log('welcome to port ' + config.port);