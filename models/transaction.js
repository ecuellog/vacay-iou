var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema(
  {
    name: String,
    date: Date,
    whoPaid: [String], //Id of friend
    whoBenefited: [String], //Id of friend
    type: {
      type: String,
      enum: ['expense', 'payment']
    },
    amountDollars: Number,
    amountCents: Number,
    //creator: String,        //For now, a single transaction can't be made without a ledger
    ledger: String
  },
  {
    timestamps: true
  }
);

/*transactionSchema.statics.findByCreator = function(userId, callback){
    return this.find({ creator: userId }).exec(callback);
}*/

transactionSchema.statics.findByLedger = function(ledgerId, callback) {
  return this.find({ ledger: ledgerId }).exec(callback);
};

module.exports = mongoose.model('transaction', transactionSchema);
