var express = require('express');
var router = express.Router();
var tokens = require('../tokens');
var Ledger = require('../models/ledger');
var Friend = require('../models/friend');
var Invite = require('../models/invite');
var transactions = require('./transactions');
var mongoose = require('mongoose');
var avatarColors = require('../constants/avatarColors');
var email = require('../other/email');

//Get all user created ledgers
router.get('/created', tokens.checkTokens, (req, res) => {
  Ledger.findCreated(req.decoded.user_id, (err, docs) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ ledgers: docs });
  });
});

//Get all ledgers shared to user
router.get('/shared', tokens.checkTokens, (req, res) => {
  Ledger.findShared(req.decoded.user_id, (err, docs) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ ledgers: docs });
  });
});

//Get single user ledger
router.get('/:ledgerId', (req, res) => {
  //Should have a locked field in case the creator doesnt want to share it by link. But for now, itll be available for everyone to see
  Ledger.findById(req.params.ledgerId, (err, ledger) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({
      ledger: ledger
    });
  });
});

//Create new ledger
router.post('/', tokens.checkTokens, async (req, res, next) => {
  let session = await mongoose.startSession();
  session.startTransaction();

  let ledgerParticipants = [];
  let ledgerSharedWith = [];
  let friendsToCreate = [];
  let invitesToCreate = [];

  if (req.body.name === '') {
    return res.status(400).json({
      error: 'Tab name is required'
    });
  }

  try {
    for (const participant of req.body.participants) {
      if (!participant.friend) {
        let newFriend = new Friend({
          friendOf: req.decoded.user_id,
          name: participant.name,
          email: participant.email,
          userId: null,
          avatarColor: avatarColors.getRandomColor(),
          avatarSrc: null
        });

        friendsToCreate.push(newFriend);

        ledgerParticipants.push({
          friend: newFriend._id,
          invited: participant.invited
        });
      } else {
        ledgerParticipants.push(participant);
      }
    }

    var newLedger = new Ledger({
      name: req.body.name,
      creator: req.decoded.user_id,
      participants: ledgerParticipants,
      sharedWith: ledgerSharedWith,
      transactions: []
    });

    for (const participant of ledgerParticipants) {
      if (!participant.invite) continue;
      if (participant.userId) {
        // This is wrong TODO
        ledgerSharedWith.push(participant.userId);
        // Send email/push notification that a ledger has been shared
      } else {
        // Create email invite, send invite link to email
        let newInvite = new Invite({
          ledgerId: newLedger._id,
          friendId: participant.friend
        });

        invitesToCreate.push(newInvite);
      }
    }

    await newLedger.save({ session });
    await Friend.create(friendsToCreate, { session });
    await Invite.create(invitesToCreate, { session });

    await sendEmailInvites(invitesToCreate);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      ledger: newLedger,
      newFriends: friendsToCreate,
      message: 'Ledger created.'
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
});

function sendEmailInvites(invites) {
  let promises = [];

  invites.forEach(invite => {
    let newPromise = new Promise((resolve, reject) => {
      Friend.findById(invite.friendId)
        .then(friend => {
          let mailOptions = {
            from: 'noreply_vacaytabs@gmail.com',
            to: friend.email,
            subject: 'A tab has been shared with you via VacayTabs',
            text: `Someone has shared a tab with you via VacayTabs, click the link below to accept the invitation ${invite._id}`
          };

          email.transport.sendMail(mailOptions, (error, info) => {
            if (error) {
              reject(error);
              console.error(error);
            } else {
              resolve(info);
              console.log('Email sent: ' + info.response);
            }
          });
        })
        .catch(error => {
          reject(error);
        });
    });

    promises.push(newPromise);
  });

  return Promise.all(promises);
}

router.use('/:ledgerId/transactions', transactions);

module.exports = router;
