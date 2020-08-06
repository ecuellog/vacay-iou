var express = require('express');
var router = express.Router({mergeParams: true});
var tokens = require('../tokens');
var Friend = require('../models/friend');

/* Nested from /friends */

//Get all friends of user
router.get('/', tokens.checkTokens, (req, res) => {
  Friend.findByFriendOf(req.decoded.user_id, (err, docs) => {
      if(err){
          return res.status(500).json({error: err});
      }
      return res.status(200).json({friends: docs});
  });
});

module.exports = router;