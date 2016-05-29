var bodyParser = require('body-parser')
var Image 	   = require('../models/image')
var Comment    = require('../models/comments')
var Album 	   = require('../models/album')
var Submission = require('../models/submission')
var fs  	   = require('fs')
var config     = require('../../config')
var AWS 	   = require('aws-sdk')
var inspect    = require('util').inspect
var multiparty = require('multiparty')

var s3Stream = require('s3-upload-stream')(new AWS.S3({
  	accessKeyId: config.key,
  	secretAccessKey: config.secret
}))


module.exports = (app, express) => {
	var imgRouter = express.Router()
	imgRouter.post('/upload', (req, res) => {
		var submission = new Submission(),
			filesLength = JSON.parse(req.get('files-length')),
			counter = 0,
			sizeInBytes = 0,
			form = new multiparty.Form();

			form.on('error', function(err) {
				res.end('There was a problem parsing the file')
			})
			form.on('part', function(part) {

				var image = new Image({
	        		size: sizeInBytes
	        	})

				if (part.filename) {
					saveFileToDatabase(image, res)
		        		.then(mongoDocument => {
		        			part.resume()
		        			uploadToAmazon(part, String(mongoDocument.imageId))
		        				.then(data => {
						        	counter++
					        		submission.pictures.push(mongoDocument.imageId)
					        		if (counter === filesLength) {
					        			saveSubmissionToDatabase(submission, res)
					        				.then((mongoSubmission) => {
					        					res.json(mongoSubmission)
					        				})
					        		}
		        				}) // gotta catch fo error on upload and delete the file from database if the upload has failed.
		        		})
		        		.catch(err => {
		        			console.log(err)
		        		})
				}
				part.on('error', function(err) {

				})
			})
			form.parse(req)	 
	})

	imgRouter.get('/hot', (req, res) => {
		Submission.find({}, (err, submissions) => {
			if (err) res.send(err)
			var docs = {}, counter = 0
			submissions.forEach((submission) => {
				docs[submission._id] = submission.pictures
				    counter++
				    if (counter === submissions.length)
				    	res.json(docs)
			})
		})
	})

	imgRouter.post('/submission', (req, res) => {
		var submissionId = req.body.submissionId;
		Submission.findById(submissionId, (err, submission) => {
			if (err) res.send(err)
			res.json(submission.pictures)
		})
	})

	return imgRouter;
}

function saveFileToDatabase (image, res, cb) {
	return new Promise((resolve, reject) => {
		image.save((err, mongoReturnDocument) => {
			if (err) {
				if (err.code == 11000)
					reject({ success: false, message: 'Duplicate' });
				else
					reject({ success: false, message: 'Saved to Amazon, but not to database', error: err })
			} else {
				res.statusCode = 200;
				resolve({ message: 'Image added!', imageId: mongoReturnDocument._id })
			}
		})
	})
}

function saveSubmissionToDatabase(submission, res, cb) {
	return new Promise((resolve, reject) => {
		submission.save((err, mongoReturnDocument) => {
			if (!err) {
				res.statusCode = 200
				resolve({ message: 'Submission added!', submissionId: mongoReturnDocument._id })
			} else {
				reject(err)
			}
		})
	})
}

function uploadToAmazon (readStream, key, callback) {
	return new Promise((resolve, reject) => {
		var upload = s3Stream.upload({
	    	'Bucket': config.bucket,
	    	'Key': key
	  	});
	  	upload.on('error', err => reject(err))
	  	upload.on('part', details => console.log(inspect(details)))
	  	upload.on('uploaded', details => resolve(details))

  		readStream.pipe(upload)
	})
}
