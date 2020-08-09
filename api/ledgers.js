var express = require('express');
var router = express.Router();
var tokens = require('../tokens');
var Ledger = require('../models/ledger');
var Friend = require('../models/friend');
var transactions = require('./transactions');
var mongoose = require('mongoose');

//Get all user created ledgers
router.get('/created', tokens.checkTokens, (req, res) => {
    Ledger.findCreated(req.decoded.user_id, (err, docs) => {
        if(err){
            return res.status(500).json({error: err});
        }
        return res.status(200).json({ledgers: docs});
    });
});

//Get all ledgers shared to user
router.get('/shared', tokens.checkTokens, (req, res) => {
    Ledger.findShared(req.decoded.user_id, (err, docs) => {
        if(err){
            return res.status(500).json({error: err});
        }
        return res.status(200).json({ledgers: docs});
    });
});

//Get single user ledger
router.get('/:ledgerId', (req, res) => {
    //Should have a locked field in case the creator doesnt want to share it by link. But for now, itll be available for everyone to see
    Ledger.findById(req.params.ledgerId, (err, ledger) => {
        if(err){
            return res.status(500).json({error: err});
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

    try {
        for(const participant of req.body.participants) {
            if(!participant.friend) {
                let newFriend = new Friend({
                    friendOf: req.decoded.user_id,
                    name: participant.name,
                    email: participant.email,
                    userId: null,
                    avatarColor: null,
                    avatarSrc: null
                });

                friendsToCreate.push(newFriend);

                ledgerParticipants.push({
                    friend: newFriend._id,
                    invited: participant.invited
                })
                // TODO: send email invite
            } else {
                ledgerParticipants.push(participant);
            }
        }

        ledgerParticipants.forEach(participant => {
            if(!participant.invited) return;
            if(participant.userId) {
                ledgerSharedWith.push(participant.userId);
                // Send email/push notification that a ledger has been shared
            } else {
                // Create email invite, send invite link to email
            }
        });

        var newLedger = new Ledger({
            name: req.body.name,
            creator: req.decoded.user_id,
            participants: ledgerParticipants,
            sharedWith: ledgerSharedWith,
            transactions: []
        });

        await newLedger.save({session});
        await Friend.create(friendsToCreate, {session});

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            ledger: newLedger,
            newFriends: friendsToCreate,
            message: 'Ledger created.'
        });
    } catch(err) {
        await session.abortTransaction();
        session.endSession();
        return next(err);
    }
});

router.use('/:ledgerId/transactions', transactions);

module.exports = router;