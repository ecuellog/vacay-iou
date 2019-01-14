var express = require('express');
var router = express.Router({mergeParams: true});
var tokens = require('../tokens');
var Transaction = require('../models/transaction');
var Ledger = require('../models/ledger')

/* Nested from /ledgers/:ledgerId/transactions */

//List all ledger transactions
router.get('/', tokens.checkTokens, (req, res, next) => {
    console.log('ledgerId');
    console.log(req.params.ledgerId);
    Ledger.findById(req.params.ledgerId, (err, ledger) => {
        if(err) return next(err);
        if(!ledger){
            return res.status(404).json({
                message: 'Ledger not found'
            });
        }
        if(req.decoded.user_id !== ledger.creator){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        Transaction.findByLedger(ledger._id, (err, transactions) => {
            if(err) return next(err);
            return res.status(200).json({
                transactions: transactions
            });
        });
    });
});

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
    console.log('tokens checked');
    console.log(req.params.ledgerId);
    Ledger.findById(req.params.ledgerId, (err, ledger) => {
        console.log('finding ledger...')
        console.log(err, ledger);
        if(err) return next(err);
        if(ledger.creator !== req.decoded.user_id){
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        return next();
    });
}, (req, res, next) => {
    var newTransaction = new Transaction({
        name: req.body.name,
        date: Date.now(),
        //We should be checking that the whoPaid and whoBenefited exists in ledger.persons
        whoPaid: req.body.whoPaid,
        whoBenefited: req.body.whoBenefited,
        type: req.body.type,
        amountDollars: req.body.amountDollars,
        amountCents: req.body.amountCents,
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