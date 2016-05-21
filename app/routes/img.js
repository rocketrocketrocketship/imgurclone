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

function uploadS3 (readStream, key, callback) {
  	var upload = s3Stream.upload({
    	'Bucket': config.bucket,
    	'Key': key
  	});

  	upload.on('error', function (err) {
    	callback(err);
  	});

  	upload.on('part', function (details) {
    	console.log(inspect(details));
  	});

  	upload.on('uploaded', function (details) {
    	console.log(inspect(details));
    	callback(null, details);
  	});

  	// Pipe the Readable stream to the s3-upload-stream module.
  	readStream.pipe(upload);
}
module.exports = function(app, express) {

	var imgRouter = express.Router();

	imgRouter.post('/upload', (req, res) => {
		// Saves user images to AMAZON S3 servers
		// TODO: maybe make this logic to its own function because right now we're uploading and saving to database in this one function.
		// maybe break this stuff into smaller functions and move to another folders and files. 
		var busboy = new Busboy({ headers: req.headers });
	    if (req.busboy) {
	        req.busboy.on('file', function(fieldname, file, filename, encoding) {
	        	uploadS3(file, filename, function (err, data) {
			        if (!err) {
			        	var image = new Image({
			        		ip: null,
			        		fileName: filename,
			        		size: null,
			        		amazonLink: data.Location,
			        		upvotes: null,
			        		downvotes: null,
			        		tags: null,
			        		comments: null
			        	});
			        	image.save(function (err, mongoReturnDocument) {
			        		if (err) {
								if (err.code == 11000) {
									return res.json({ success: false, message: 'Duplicate'});
								}
								else {
									return res.json({ success: false, message: 'Saved to Amazon, but not to database', error: err});
								}
							}
							res.statusCode = 200;
							res.json({ message: 'Image added!', imageId: mongoReturnDocument._id });
			        	})
			        } else {
			        	res.statusCode = 500;
			          	res.end(err);
			        }
	      		});

			});
	        return req.pipe(req.busboy);
	    }
	});
	imgRouter.post('/single', (req, res) => {
		var imageId = req.body.imageId;
		Image.findById(imageId, (err, image) => {
			if (err) res.send(err);
			res.json(image.amazonLink);
		})
	})
	return imgRouter;
};
