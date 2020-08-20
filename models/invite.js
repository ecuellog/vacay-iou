var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var inviteSchema = new mongoose.Schema(
  {
    friendId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    ledgerId: {
      type: Schema.Types.ObjectId,
      ref: 'Legder'
    }
  },
  {
    timestamps: true,
    autoCreate: true
  }
);

module.exports = mongoose.model('Invite', inviteSchema);
