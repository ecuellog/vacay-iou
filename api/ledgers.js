var express = require('express');
var router = express.Router();
var tokens = require('../tokens');
var Ledger = require('../models/ledger');
var transactions = require('./transactions');

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
router.post('/', tokens.checkTokens, (req, res, next) => {
    var newLedger = new Ledger({
        name: req.body.name,
        creator: req.decoded.user_id,
        persons: req.body.persons,
        sharedWith: [],
        transactions: []
    });

    newLedger.save(err => {
        if(err) return next(err);
        return res.status(200).json({
            ledger: newLedger,
            message: 'Ledger created.'
        });
    });
});

router.use('/:ledgerId/transactions', transactions);

module.exports = router;