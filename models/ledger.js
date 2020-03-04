var mongoose = require('mongoose');

var ledgerSchema = new mongoose.Schema({
	name: String,
	creator: String,
	persons: [{type: String, unique: true}],
    sharedWith: [String]
}, {
    timestamps: true
});

ledgerSchema.statics.findCreated = function(userId, callback) {
    return this.find({ creator: userId }).exec(callback);
}

ledgerSchema.statics.findShared = function(userId, callback) {
    //If the userID is in the extraUsers array, return it. Not sure if this will work yet.
    return this.find({ sharedWith: userId }).exec(callback);
}

module.exports = mongoose.model('Ledger', ledgerSchema);