var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router();
var config = require('../config');
var User = require('../models/user');

//Create new user
router.post('/register', (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
    let password = req.body.password;

    if(!name || !email || !password) {
    	return res.status(400).json({
    		message: 'Invalid request'
    	});
    }

	User.findByEmailLogin(email, (err, user) => {
		if(user){
			return res.status(409).json({
				message: 'Email already in use'
			});
		}
		let saltRounds = 10;
		bcrypt.hash(password, saltRounds, (err, hash) => {
			var newUser = new User({
				name: name,
				email: email,
				passwordHash: hash,
				provider: 'email',
				subject: 'none'
			});

			newUser.save(err => {
				if(err){
					return res.status(500).json({message: 'Server Error: ' + err});
				}
				return res.status(200).json({user: newUser});
			});
		});
	});
});

//Email login only
router.post('/login', (req, res) => {
	let email = req.body.email;
    let password = req.body.password;

    if(!email || !password) {
    	return res.status(400).json({
    		message: 'Invalid request'
    	});
    }
	User.findByEmailLogin(email, (err, user) => {
		if(err){
			return res.status(401).json({
				message: 'Failed to log in'
			});
		}
		bcrypt.compare(password, user.passwordHash, (err, valid) => {
			if(valid){
				let token = jwt.sign({ user_id: user._id }, config.jwtSecret);
				return res.status(200).json({
					message: 'Login successful',
					app_token: token
				});
			} else {
				return res.status(401).json({
					message: 'Failed to log in'
				});
			}
		});
	});
});

module.exports = router