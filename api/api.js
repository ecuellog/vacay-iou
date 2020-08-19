const express = require('express');
const router = express.Router();
const users = require('./users');
const auth = require('./auth');
const ledgers = require('./ledgers');
const friends = require('./friends');

router.use('/users', users);
router.use('/auth', auth);
router.use('/ledgers', ledgers);
router.use('/friends', friends);

module.exports = router;
