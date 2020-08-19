var mongoose = require('mongoose');

var friendSchema = new mongoose.Schema(
  {
    friendOf: String, // User id of who's friend this is
    name: String,
    email: {
      type: String,
      lowercase: true
    },
    userId: String, // User id of this friend if linked to an app user, null otherwise
    avatarColor: String,
    avatarSrc: String
  },
  {
    timestamps: true,
    autoCreate: true
  }
);

friendSchema.statics.findByFriendOf = function(friendOfId, callback) {
  return this.find({
    friendOf: friendOfId
  }).exec(callback);
};

module.exports = mongoose.model('Friend', friendSchema);
