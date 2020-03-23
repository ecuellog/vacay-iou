require('console-error');
require('console-info');
var jwt = require('jsonwebtoken');
var randToken = require('rand-token');
var bcrypt = require('bcrypt');
var config = require('./config');
var User = require('./models/user');
var RefreshTokenStore = require('./models/refreshTokenStore');

var checkTokens = function(req, res, next) {
  var accessToken = req.cookies['access-token'];
  var refreshToken = req.cookies['refresh-token'];
  var csrfToken = req.headers['x-csrf-token'];

  if (accessToken) {
    //Verify the access token
    jwt.verify(accessToken, config.jwtSecret, (err, decoded) => {
      //Access token valid
      if(err == null) {
        if(decoded.csrf_token !== csrfToken) {
          return res.status(401).json({
            message: 'Invalid token'
          });
        }
        req.decoded = decoded;
        return next();
      }

      //Access Token Expired
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
            console.error('Error refresing tokens: ' + err);
            return res.status(401).json({
              message: 'Token expired. Invalid refresh token'
            });
          }
          setTokenCookies(res, newTokens);
          return next();
        });
      }

      //Access token invalid    
      else {
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

var refreshTokens = function(atPayload, rt, callback) {
  RefreshTokenStore.validate(atPayload.user_id, rt, (err, valid) => {
    if(err){
      return callback(err, null);
    }
    if(valid){
      createNewTokens(atPayload.user_id, rt, (err, newTokens) => {
        if(err){
          return callback(err, null);
        }
        return callback(null, newTokens);
      });
    } else {
      let error = new Error('Refresh token invalid');
      return callback(error, null);
    }
  });
};

var createNewTokens = function(userId, oldRt, callback){
  let csrfToken = randToken.generate(16);

  let accessToken = jwt.sign({
    user_id: userId,
    csrf_token: csrfToken
  }, config.jwtSecret,
  {
    expiresIn: '15m' //testing 5s, real 15m.
  });

  let tokens = {
    accessToken: accessToken,
    refreshToken: oldRt,
    csrfToken: csrfToken
  };

  var generateNewRt = function() {
    console.info('New token created');
    tokens.refreshToken = randToken.generate(16);
    RefreshTokenStore.create(userId, tokens.refreshToken, (err) => {
      if(err) return callback(err, null);
      return callback(null, tokens);
    });
  }

  //If an old refresh token was passed, delete it from database first.
  if(oldRt){
    RefreshTokenStore.deleteByToken(oldRt, (err, tokenDeleted) => {
      if(err) return callback(err, null);
      //If no token was deleted, it was already deleted by a parallel request and a new tokens have already been created.
      if(!tokenDeleted){
        console.info('Tokens had already been created');
        tokens.accessToken = null;
        tokens.refreshToken = null;
        tokens.csrfToken = null;
        return callback(null, tokens);
      } else {
        generateNewRt();
      }
    });
  } else {
    generateNewRt();
  }
}

var setTokenCookies = function(res, tokens) {
  if(tokens.accessToken) res.cookie('access-token', tokens.accessToken, {httpOnly: true/*, secure: true*/});
  if(tokens.refreshToken) res.cookie('refresh-token', tokens.refreshToken, {httpOnly: true/*, secure: true*/});
  if(tokens.csrfToken) res.cookie('csrf-token', tokens.csrfToken/*, {secure: true}*/);
}

var deleteTokenCookies = function(res) {
  res.clearCookie('access-token');
  res.clearCookie('refresh-token');
  res.clearCookie('csrf-token');
}

module.exports = {
  checkTokens: checkTokens,
  createNewTokens: createNewTokens,
  setTokenCookies: setTokenCookies,
  deleteTokenCookies: deleteTokenCookies
}