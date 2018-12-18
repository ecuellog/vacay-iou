var mongoose = require('mongoose');

//A nonUser is a person that was added to a transaction but that isn't registered to the app yet.
var nonUserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        lowercase: true
    }
});