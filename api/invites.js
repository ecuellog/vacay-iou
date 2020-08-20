var express = require('express');
var router = express.Router({ mergeParams: true });
var tokens = require('../tokens');
var Ledger = require('../models/ledger');
var Invite = require('../models/invite');
var Friend = require('../models/friend');
var User = require('../models/user');
var mongoose = require('mongoose');

// Accept an invite
router.get('/:inviteId/accept', tokens.checkTokens, async (req, res) => {
  let session = await mongoose.startSession();
  session.startTransaction();

  try {
    let invite = await Invite.findById(req.params.inviteId);
    let friend = await Friend.findById(invite.friendId);
    let ledger = await Ledger.findById(invite.ledgerId);
    let user = await User.findById(req.decoded.user_id);

    friend.userId = req.decoded.user_id;
    friend.email = user.email;
    friend.avatarSrc = user.avatarSrc;
    friend.avatarColor = user.avatarColor;
    ledger.sharedWith = [...ledger.sharedWith, req.decoded.user_id];

    await friend.save({ session });
    await ledger.save({ session });
    await invite.remove({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: 'Invite accepted.'
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
});

module.exports = router;
