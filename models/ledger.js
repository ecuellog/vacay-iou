var mongoose = require('mongoose');

var ledgerSchema = new mongoose.Schema(
  {
    name: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    participants: [Object],
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ] //userIds
  },
  {
    timestamps: true,
    autoCreate: true
  }
);

ledgerSchema.statics.findCreated = function(userId, callback) {
  return this.find({ creator: userId }).exec(callback);
};

ledgerSchema.statics.findShared = function(userId, callback) {
  return this.find({ sharedWith: { $in: [userId] } }).exec(callback);
};

module.exports = mongoose.model('Ledger', ledgerSchema);
