var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId     = mongoose.Schema.Types.ObjectId;
var bcrypt 		 = require('bcrypt-nodejs');

// Album schema 

var AlbumSchema = new Schema({
	albumName: String,
	pictures: { type: [ObjectId], default: [] }
}, {collection: 'albums'});

AlbumSchema.pre('save', function(next) {
	var user = this;
	next();
});


module.exports = mongoose.model('Album', AlbumSchema);