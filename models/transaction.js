var mongoose = require('mongoose');

var transaction = new mongoose.Schema({
    name: String,
    date: Date,
    whoPaid: [String],        //ID of user or nonUser
    whoBenefited: [String],   //ID of user or nonUser
    type: {
        type: String,
        enum: ['expense', 'payment']
    },
    creator: String,
    ledger: String
});

transactionSchema.statics.findByCreator = function(userId, callback){
    return this.find({ creator: userId }).exec(callback);
}

transactionSchema.statics.findByLedger = function(ledgerId, callback){
    return this.find({ ledger: ledgerId }).exec(callback);
}

module.exports = mongoose.model('transaction', transactionSchema);