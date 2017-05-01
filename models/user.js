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

User.getUserByUsername = (username, callback) => {
    User.findOne({'username': username}, callback);
}

User.getUserById = (id, callback) => {
    User.findById(id, callback);
}

User.comparePassword = (typedPassword, hash, callback) => {
    bcrypt.compare(typedPassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports = User;