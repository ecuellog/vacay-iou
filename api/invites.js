var express = require('express');
var router = express.Router({ mergeParams: true });
var tokens = require('../tokens');
var Ledger = require('../models/ledger');
var Invite = require('../models/invite');
var Friend = require('../models/friend');
var mongoose = require('mongoose');

// Accept an invite
router.get('/:inviteId/accept', tokens.checkTokens, async (req, res) => {
  let session = await mongoose.startSession();
  session.startTransaction();

  try {
    let invite = await Invite.findById(req.params.inviteId);
    let friend = await Friend.findById(invite.friendId);
    let ledger = await Ledger.findById(invite.ledgerId);

    friend.userId = req.decoded.userId;
    ledger.sharedWith = [...ledger.sharedWith, req.decoded.userId];

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
