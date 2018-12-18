var mongoose = require('mongoose');

var ledgerSchema = new mongoose.Schema({
	name: String,
	creator: String,
	extraUsers: [String],
    transactions: [String]
});

ledgerSchema.statics.findCreated = function(userId, callback) {
    return this.find({creator: userId}).exec(callback);
}

ledgerSchema.statics.findShared = function(userId, callback) {
    //If the userID is in the users array, return it. Not sure if this will work yet.
    return this.find({ users: userId }).exec(callback);
}

module.exports = mongoose.model('Ledger', ledgerSchema);