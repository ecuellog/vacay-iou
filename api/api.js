const express = require('express');
const router = express.Router();
const users = require('./users');
const auth = require('./auth');
const ledgers = require('./ledgers');
const friends = require('./friends');
const invites = require('./invites');

router.use('/users', users);
router.use('/auth', auth);
router.use('/ledgers', ledgers);
router.use('/friends', friends);
router.use('/invites', invites);

module.exports = router;
