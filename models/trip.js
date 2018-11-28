var mongoose = require('mongoose');

var tripSchema = new mongoose.Schema({
	name: String,
	creator: String,
	users: [String]
});

module.exports = mongoose.model('Trip', tripSchema);