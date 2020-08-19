var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router();
var config = require('../config');
var User = require('../models/user');
var Friend = require('../models/friend');
var RefreshTokenStore = require('../models/refreshTokenStore');
var tokens = require('../tokens');
var mongoose = require('mongoose');
var avatarColors = require('../constants/avatarColors');

// Create new user
router.post('/register', (req, res, next) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Invalid request'
    });
  }

  User.findByEmailLogin(email, (err, user) => {
    if (user) {
      return res.status(400).json({
        message: 'Email already in use'
      });
    }
    let saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      let session = await mongoose.startSession();
      session.startTransaction();

      try {
        let newUser = new User({
          name: name,
          email: email,
          passwordHash: hash,
          provider: 'email',
          subject: 'none',
          avatarColor: avatarColors.getRandomColor(),
          avatarSrc: null
        });

        await newUser.save({ session });

        await Friend.create(
          [
            {
              friendOf: newUser._id,
              name: newUser.name,
              email: newUser.email,
              userId: newUser._id,
              avatarColor: newUser.avatarColor,
              avatarSrc: null
            }
          ],
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
          message: 'Sign up successful',
          user: newUser
        });
      } catch (err) {
        console.error(err);
        session.abortTransaction();
        session.endSession();
        return next(err);
      }
    });
  });
});

// Email login
router.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Invalid request'
    });
  }
  User.findByEmailLogin(email, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({
        message: 'Failed to log in. Invalid email or password'
      });
    }
    bcrypt.compare(password, user.passwordHash, (err, valid) => {
      if (valid) {
        tokens.createNewTokens(user._id, null, (err, newTokens) => {
          if (err) {
            console.error('Error creating tokens', err);
            return res.status(500).json({
              message: 'Server error'
            });
          }
          tokens.setTokenCookies(res, newTokens);
          return res.status(200).json({
            user: {
              _id: user._id,
              name: user.name,
              email: user.email
            },
            message: 'Login successful'
          });
        });
      } else {
        return res.status(400).json({
          message: 'Failed to log in. Invalid email or password.'
        });
      }
    });
  });
});

router.get('/logout', tokens.checkTokens, (req, res, next) => {
  RefreshTokenStore.deleteByToken(
    req.cookies['refresh-token'],
    (err, tokenDeleted) => {
      if (err) return next();
      tokens.deleteTokenCookies(res);
      return res.status(200).json({
        message: 'Logout successful'
      });
    }
  );
});

module.exports = router;
