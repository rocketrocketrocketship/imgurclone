var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId     = mongoose.Schema.Types.ObjectId;
var bcrypt 		 = require('bcrypt-nodejs');

// Submission schema 

var Submission = new Schema({
	pictures: { type: [ObjectId], default: [] },
	ip: Number,
	date: { type: Date, default: Date.now },
	upvotes: Number,
	downvotes: Number,
	tags: { type: [String], default: [''] },
	comments: { type: [ObjectId], default: [] }
}, {collection: 'submissions'});

Submission.pre('save', function(next) {
	var user = this;
	next();
});


module.exports = mongoose.model('Submission', Submission);