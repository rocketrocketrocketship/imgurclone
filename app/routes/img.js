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
  	upload.on('error', err => callback(err));
  	upload.on('part', details => console.log('deeets', inspect(details)));
  	upload.on('uploaded', details => callback(null, details));

  	// Pipe the Readable stream to the s3-upload-stream module.
  	readStream.pipe(upload);
}
module.exports = (app, express) => {

	var imgRouter = express.Router();

	imgRouter.post('/upload', (req, res) => {
		var filesLength = JSON.parse(req.get('files-length')),					// get files length first and determine if we need an album or not
			counter = 0,
			album;
		if (filesLength > 1) {
			album = new Album();
		}
		var busboy = new Busboy({ headers: req.headers });						// Saves user images to AMAZON S3 servers
	    if (req.busboy) {														// TODO: maybe make this logic to its own function because right now we're uploading and saving to database in this one function.													
	        req.busboy.on('file', (fieldname, file, filename, encoding) => {	// maybe break this stuff into smaller functions and move to another folders and files. 
	        	uploadS3(file, filename, (err, data) => {
			        if (!err) {
			        	var image = new Image({
			        		ip: null,
			        		fileName: filename,
			        		size: null,
			        		amazonLink: data.Location
			        	});
			        	image.save((err, mongoReturnDocument) => {		// save single image to database
			        		if (err) {
								if (err.code == 11000) {
									return res.json({ success: false, message: 'Duplicate'});
								}
								else {
									return res.json({ success: false, message: 'Saved to Amazon, but not to database', error: err});
								}
							} else if (!album) {								// if there was only one image, not album, then return that image's ID to front-end.
								res.statusCode = 200;
								res.json({ message: 'Image added!', imageId: mongoReturnDocument._id });
							} else {
								counter++;										// update image counter so we know when the stream has ended and all the images are in
								album.pictures.push(mongoReturnDocument._id);	// the album object and finally save the album and return album ID to front-end.
								if (counter === filesLength) {
									album.save((err, mongoReturnDocument) => {
										if (!err) {
											res.statusCode = 200;
											res.json({ message: 'Album added!', albumId: mongoReturnDocument._id });	
										}
									});
								}
							}
			        	});
			        } else {
			        	res.statusCode = 500;
			          	res.end(err);
			        }
	      		});

			});
	        return req.pipe(req.busboy);
	    }
	});
	imgRouter.post('/single', (req, res) => {			// router for single images
		var imageId = req.body.imageId;
		Image.findById(imageId, (err, image) => {
			if (err) res.send(err);
			res.json(image.amazonLink);
		})
	});

	imgRouter.post('/album', (req, res) => {			// router for getting images from an album
		var albumId = req.body.albumId;
		Album.findById(albumId, (err, album) => {
			if (err) res.send(err);
			Image.find({
				'_id': { $in: album.pictures }}, 
				'amazonLink', 
				function (err, docs) {
				    res.json(docs);
				}
			);
		})
	});

	return imgRouter;
};
