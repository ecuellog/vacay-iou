var mongoose = require('mongoose');

var inviteSchema = new mongoose.Schema(
  {
    friendId: String,
    ledgerId: String
  },
  {
    timestamps: true,
    autoCreate: true
  }
);

module.exports = mongoose.model('Invite', inviteSchema);
