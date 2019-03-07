require('console-info');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var config = require('../config');

var refreshTokenStoreSchema = new mongoose.Schema({
    userId: String,
    tokenHash: String,
    lastUpdated: Date
});

refreshTokenStoreSchema.statics.create = function(userId, rt, callback){
    bcrypt.hash(rt, config.saltRounds, (err, hash) => {
        if(err){
            let error = new Error('Error hashing refresh token: ' + err);
            return callback(error);
        }
        var newRt = new this({
            userId: userId,
            tokenHash: hash,
            lastUpdated: Date.now()
        });
        newRt.save(err => {
            if(err) return err;
            return callback(null);
        });
    });
}

refreshTokenStoreSchema.statics.findByUser = function(userId, callback){
    return this.find({
        userId: userId
    }).exec(callback);
}

refreshTokenStoreSchema.statics.findByToken = function(rt, callback){
    var foundToken = null;
    var promises = [];

    this.find({}, (err, tokens) => {
        if(err){
            let error = new Error('Error finding refresh tokens: ' + err);
            return callback(error, null);
        }
        for(let token of tokens){
            promises.push(new Promise((resolve, reject) => {
                bcrypt.compare(rt, token.tokenHash, (err, valid) => {
                    if(err){
                        console.log('ERROR COMPARING HASH RT TOKEN');
                        let error = new Error('Error comparing hashes: ' + err);
                        reject(error);
                    }
                    if(valid){
                        foundToken = token;
                    }
                    resolve();
                });
            }));
        }
        Promise.all(promises).then(() => {
            callback(null, foundToken);
        }).catch((err) => {
            callback(err, null);
        });
    });   
}

//Deletes any tokens that match the given refresh token. Returns true if any tokens were deleted and false otherwise. 
refreshTokenStoreSchema.statics.deleteByToken = function(rt, callback){
    var promises = [];
    var tokenDeleted = false;

    this.find({}, (err, tokens) => {
        if(err){
            let error = new Error('Error finding refresh tokens: ' + err);
            return callback(error);
        }
        for(let token of tokens){
            promises.push(new Promise((resolve, reject) => {
                bcrypt.compare(rt, token.tokenHash, (err, valid) => {
                    if(err){
                        reject(new Error('Error comparing hashes: ' + err));
                    }
                    if(valid){
                        this.findOneAndDelete({_id: token._id}, (err, deletedToken) => {
                            if(err) reject(new Error('Error deleting from DB: ' + err));
                            tokenDeleted = Boolean(deletedToken);
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            }));
        }
        Promise.all(promises).then(() => {
            callback(null, tokenDeleted);
        }).catch((err) => {
            callback(err, null);
        });
    });
}

refreshTokenStoreSchema.statics.validate = function(userId, rt, callback){
    var rtValid = false;
    var promises = [];

    this.findByUser(userId, (err, tokens) => {
        if(err){
            let error = new Error('Error finding refresh tokens: ' + err);
            return callback(error, null);
        }
        for(let token of tokens){
            promises.push(new Promise((resolve, reject) => {
                bcrypt.compare(rt, token.tokenHash, (err, valid) => {
                    if(err){
                        console.log('ERROR COMPARING HASH RT TOKEN');
                        let error = new Error('Error comparing hashes: ' + err);
                        reject(error);
                    }
                    if(valid){
                        rtValid = true;
                    }
                    resolve();
                });
            }));
        }
        Promise.all(promises).then(() => {
            callback(null, rtValid);
        }).catch((err) => {
            callback(err, null);
        });
    });   
}

module.exports = mongoose.model('RefreshTokenStore', refreshTokenStoreSchema);