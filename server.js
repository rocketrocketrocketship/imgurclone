// BASE SETUP
// ======================================

// PACKAGES --------------------
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var config 	   = require('./config');
var path 	   = require('path');
var Busboy     = require("connect-busboy");


// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true, limit:'50mb' }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(Busboy());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (hosted on google cloud)
mongoose.connect(config.database); 

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));


// enable trust proxy. if true, the client’s IP address is understood as the left-most entry in 
// the X-Forwarded-* header
 
app.enable('trust proxy');

// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
var imgRoutes = require('./app/routes/img')(app, express);
var cmntRoutes = require('./app/routes/cmnt')(app, express);

app.use('/img', imgRoutes);
app.use('/cmnt', cmntRoutes);

// MAIN CATCHALL ROUTE --------------- 
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);