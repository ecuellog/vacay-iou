var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		lowercase: true
	},
	passwordHash: String,
	refreshTokenHash: String,
	provider: String,
	subject: String
});

userSchema.statics.findBySubject = function(provider, subject, callback) {
	return this.findOne({
		provider: provider,
		subject: subject
	}).exec(callback);
}

userSchema.statics.findByEmailLogin = function(email, callback) {
	return this.findOne({
		provider: 'email',
		email: email
	}).exec(callback);
}

module.exports = mongoose.model('User', userSchema);