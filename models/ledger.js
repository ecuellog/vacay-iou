var mongoose = require('mongoose');

var ledgerSchema = new mongoose.Schema({
	name: String,
	creator: String,
	participants: [Object],
    sharedWith: [String]    //userIds
}, {
    timestamps: true
});

ledgerSchema.statics.findCreated = function(userId, callback) {
    return this.find({ creator: userId }).exec(callback);
}

ledgerSchema.statics.findShared = function(userId, callback) {
    return this.find({ sharedWith: {$in: [userId]} }).exec(callback); 
}

module.exports = mongoose.model('Ledger', ledgerSchema);