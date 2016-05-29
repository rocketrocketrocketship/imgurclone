var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var ObjectId     = mongoose.Schema.Types.ObjectId;
var bcrypt 		 = require('bcrypt-nodejs');
var Promise 	 = require('bluebird');
var mongoose = Promise.promisifyAll(mongoose);

// Picture schema 

var PictureSchema = new Schema({
	fileName: String,
	size: Number,
	amazonLink: String
}, {collection: 'pictures'});

PictureSchema.pre('save', function(next) {
	var user = this;
	next();
});


module.exports = mongoose.model('Image', PictureSchema);