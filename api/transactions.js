var express = require('express');
var router = express.Router();
var tokens = require('../tokens');
var Transaction = require('../models/transaction');
var Ledger = require('../models/ledger')

/* Nested from /ledgers/:ledgerId/transactions */

//List all ledger transactions

//Get single transaction
router.get('/:transactionId', (req, res, next) => {
    Transaction.findById(req.params.transactionId, (err, transaction) => {
        if(err) return next(err);
        req.transaction = transaction;

        //if the ledger is public, skip the token authorization (call next()), else...
        tokens.checkTokens(req, res, () => {
            Ledger.findById(transaction.ledger, (err, ledger) => {
                if(err) return next(err);
                if(req.decoded.user_id !== ledger.creator){
                    return res.status(401).json({
                        message: 'Unauthorized'
                    });
                }
                return next();
            });
        });
    });
}, (req, res) => {
    return res.status(200).json({
        transaction: req.transaction
    });
});

//Create a transaction in this ledger
router.post('/', tokens.checkTokens, (req, res, next) => {
    //Verify if user owns this ledger (for later, + verify if ledger is shared with user and ledger is editable by user)

    Ledger.findById(req.params.ledgerId), (err, ledger) => {
        if(err) return next(err);
        if(ledger.user_id !== req.decoded.user_id){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        return next();
    }
}, (req, res, next) => {
    var newTransaction = new Transaction({
        name: req.body.name,
        date: Date.now(),
        whoPaid: req.body.whoPaid,
        whoBenefited: req.body.whoBenefited,
        type: req.body.type,
        amountDollars: req.body.dollars,
        amountCents: req.body.cents,
        ledger: req.params.ledgerId
    });

    newTransaction.save(err => {
        if(err) return next(err);
        return res.status(200).json({
            message: 'Transaction created.'
        });
    })
})

module.exports = router;