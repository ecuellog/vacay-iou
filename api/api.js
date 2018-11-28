var express = require('express');
var router = express.Router();
var user = require('./user');
var auth = require('./auth');

router.use('/user', user);
router.use('/auth', auth);

module.exports = router