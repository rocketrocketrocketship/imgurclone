var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId     = mongoose.Schema.Types.ObjectId;
var bcrypt 		 = require('bcrypt-nodejs');

// Picture schema 

var PictureSchema = new Schema({
	ip: Number,
	fileName: String,
	size: Number,
	amazonLink: String,
	date: { type: Date, default: Date.now },
	upvotes: Number,
	downvotes: Number,
	tags: [String],
	comments: [ObjectId]
}, {collection: 'pictures'});

PictureSchema.pre('save', function(next) {
	var user = this;
	next();
});


module.exports = mongoose.model('Image', PictureSchema);