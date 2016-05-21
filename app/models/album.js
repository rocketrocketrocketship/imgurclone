var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var bcrypt 		 = require('bcrypt-nodejs');

// Album schema 

var AlbumSchema   = new Schema({
	ip: Number,
	albumName: String,
	size: Number,
	nrOfPictures: Number,
	date: { type: Date, default: Date.now },
	upvotes: Number,
	downvotes: Number,
	tags: [String],
	comments: [ObjectId],
	pictures: [ObjectId]
}, {collection: 'albums'});

AlbumSchema.pre('save', function(next) {
	var user = this;
	next();
});


module.exports = mongoose.model('Album', AlbumSchema);