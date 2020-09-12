var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = require('mongoose').Types.ObjectId;

var ledgerSchema = new mongoose.Schema(
  {
    name: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    participants: [
      {
        friend: {
          type: Schema.Types.ObjectId,
          ref: 'Friend'
        },
        invite: Boolean
      }
    ],
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

ledgerSchema.statics.findById = function(id, callback) {
  return this.findOne({ _id: ObjectId(id) })
    .populate('participants.friend')
    .exec(callback);
}

ledgerSchema.statics.findCreated = function(userId, callback) {
  return this.find({ creator: ObjectId(userId) })
    .populate('participants.friend')
    .exec(callback);
};

ledgerSchema.statics.findShared = function(userId, callback) {
  return this.find({ sharedWith: { $in: [ObjectId(userId)] } })
    .populate('participants.friend')
    .exec(callback);
};

module.exports = mongoose.model('Ledger', ledgerSchema);
