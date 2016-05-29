var bodyParser = require('body-parser');
var Busboy     = require("connect-busboy");
var Image 	   = require('../models/image');
var Comment    = require('../models/comments');
var Album 	   = require('../models/album');
var fs  	   = require('fs');
var config     = require('../../config');
var AWS 	   = require('aws-sdk');
var inspect    = require('util').inspect;

var s3Stream = require('s3-upload-stream')(new AWS.S3({
  	accessKeyId: config.key,
  	secretAccessKey: config.secret
}));


module.exports = (app, express) => {
	var front = express.Router();
	front.get('/', (req, res) => {
	

	})

	return front;
};