var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var User = require('../models/user');

//Get all users
router.get('/', middleware.checkToken, (req, res) => {
	//TODO: check for user role, if admin, continue...
	User.find({}, (err, docs) => {
		if(err){
			return res.status(500).json({error: err});
		}
		return res.status(200).json({users: docs});
	})
});

//Get single user
router.get('/:userId', middleware.checkToken, (req, res) => {
	if(req.decoded.user_id != userId) {
		return res.status(401).json({
			message: 'Unauthorized'
		});
	}
	User.findById(userId, (err, user) => {
		if(err){
			return res.status(404).json({
				message: 'User not found'
			});
		}
		return res.status(200).json({
			user: user
		});
	});
});

module.exports = router