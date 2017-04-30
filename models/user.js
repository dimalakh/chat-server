const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const db = mongoose.connection;

//Schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    }
});

// create model from scheama
const User =  mongoose.model('User', UserSchema);

User.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
} 

module.exports = User;