var bodyParser = require('body-parser')
var Comment    = require('../models/comments')
var Submission = require('../models/submission')
var fs  	   = require('fs')

module.exports = (app, express) => {
	var commentRouter = express.Router()

	commentRouter.post('/submission', (req, res) => {
		var submissionId = req.body.submissionId,
			comment 	 = new Comment();
		comment.username = req.body.username
		comment.body 	 = req.body.userContent

		saveCommentToDatabase(comment, res)
			.then(mongoDocument => {
				Submission.findByIdAndUpdate(
			        submissionId, { 
			        	$push: {"comments": mongoDocument.doc._id}},{ 
			        	safe: true,
			        	upsert: true,
			        	new : true },
			        function(err, model) {
			            res.json({'comment': mongoDocument.doc})
			        }
			    );
			})
	})

	commentRouter.get('/comments', (req, res) => {
		var submissionId = req.param('submissionId');
		Submission.findById(submissionId, (err, submission) => {
			if (err) res.send(err)
			Comment.find({
			    '_id': { $in: submission.comments}}, 
			    function (err, docs) {
			     res.json({
					'comments': docs
				})
			})
		})
	})

	return commentRouter
}

function saveCommentToDatabase (comment, res) {
	return new Promise((resolve, reject) => {
		comment.save((err, mongoReturnDocument) => {
			if (err) {
				if (err.code == 11000)
					reject({ success: false, message: 'Duplicate' });
				else
					reject({ success: false, message: 'Something went wrong', error: err })
			} else {
				res.statusCode = 200;
				resolve({ message: 'Comment added!', doc: mongoReturnDocument })
			}
		})
	})
}

