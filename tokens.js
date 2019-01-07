require('console-error');
require('console-info');
var jwt = require('jsonwebtoken');
var randToken = require('rand-token');
var bcrypt = require('bcrypt');
var config = require('./config');
var User = require('./models/user');

var checkTokens = function(req, res, next) {
    var accessToken = req.cookies['access-token'];
    var refreshToken = req.cookies['refresh-token'];
    var csrfToken = req.headers['x-csrf-token'];

    if (accessToken) {
        jwt.verify(accessToken, config.jwtSecret, (err, decoded) => {
            if(err == null){
                if(decoded.csrf_token !== csrfToken){
                    return res.status(401).json({
                        message: 'Invalid token'
                    });
                }
                req.decoded = decoded;
                return next();
            }
            if (err.name === 'TokenExpiredError') {
                decoded = jwt.decode(accessToken);
                if(decoded.csrf_token !== csrfToken){
                    return res.status(401).json({
                        message: 'Invalid token'
                    });
                }
                console.info('Token expired. Refreshing tokens.');
                req.decoded = decoded;
                refreshTokens(decoded, refreshToken, (err, newTokens) => {
                    if(err){
                        return res.status(401).json({
                            message: 'Token expired. Invalid refresh token'
                        });
                    }
                    setTokenCookies(res, newTokens);
                    return next();
                });
            } else {
                return res.status(401).json({
                    message: 'Invalid token'
                });
            }
        });
    } else {
        return res.status(401).json({
            message: 'No token'
        });
    }
};

var refreshTokens = function(atPayload, rt, callback){
    //check if refresh token exists in DB
    User.findById(atPayload.user_id, (err, user) => {
        if(!user){
            let error = new Error('No user found');
            return callback(error, null);
        } else {
            bcrypt.compare(rt, user.refreshTokenHash, (err, valid) => {
                if(err){
                    let error = new Error('Error comparing hashes: ' + err);
                    return callback(error, null);
                }
                if(valid){
                    let newTokens = createNewTokens(user._id);
                    return callback(null, newTokens);
                } else {
                    let error = new Error('Refresh token invalid');
                    return callback(error, null);
                }
            });
        }
    });
};

var createNewTokens = function(userId){
    let refreshToken = randToken.generate(16);
    bcrypt.hash(refreshToken, config.saltRounds, (err, hash) => {
        if(err){
            console.error('Error hashing refresh token: ' + err);
            return null;
        }
        User.findByIdAndUpdate(userId, { refreshTokenHash: hash }, (err) => {
            if(err){
                console.error('Error setting user refresh token: ' + err);
                return null;
            }
        })
    })

    let csrfToken = randToken.generate(16);

    let accessToken = jwt.sign({
        user_id: userId,
        csrf_token: csrfToken
    }, config.jwtSecret,
    {
        expiresIn: '15m'
    });

    let tokens= {
        accessToken: accessToken,
        refreshToken: refreshToken,
        csrfToken: csrfToken
    };

    return tokens;
}

var setTokenCookies = function(res, tokens){
    res.cookie('access-token', tokens.accessToken, {httpOnly: true/*, secure: true*/});
    res.cookie('refresh-token', tokens.refreshToken, {httpOnly: true/*, secure: true*/});
    res.cookie('csrf-token', tokens.csrfToken/*, {secure: true}*/);
}

module.exports = {
    checkTokens: checkTokens,
    createNewTokens: createNewTokens,
    setTokenCookies: setTokenCookies
}