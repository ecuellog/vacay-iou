var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var router = express.Router();
var config = require('../config');
var User = require('../models/user');
var tokens = require('../tokens');

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
			return res.status(400).json({
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
				if(err) return next(err);
				return res.status(200).json({
                    message: 'Sign up successful',
                    user: newUser
                });
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
		if(err) return next(err);
		if(!user){
			return res.status(400).json({
				message: 'Failed to log in. Invalid email or password'
			});
		}
		bcrypt.compare(password, user.passwordHash, (err, valid) => {
			if(valid){
				let newTokens = tokens.createNewTokens(user._id, null, (err, newTokens) => {
					if(err){
						console.error('Error creating tokens', err);
						return res.status(500).json({
							message: 'Server error'
						})
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

module.exports = router;