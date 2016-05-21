var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var bcrypt 		 = require('bcrypt-nodejs');

// Comment schema 

var CommentSchema   = new Schema({
	ip: Number,
	title: String,
	body: String,
	date: { type: Date, default: Date.now },
	upvotes: Number,
	downvotes: Number
}, {collection: 'comments'});


CommentSchema.pre('save', function(next) {
	var user = this;
	next();
});


module.exports = mongoose.model('Comment', CommentSchema);