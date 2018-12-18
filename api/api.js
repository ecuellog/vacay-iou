var express = require('express');
var router = express.Router();
var users = require('./users');
var auth = require('./auth');
var ledgers = require('./ledgers');

router.use('/users', users);
router.use('/auth', auth);
router.use('/ledgers', ledgers);

module.exports = router