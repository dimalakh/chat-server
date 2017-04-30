const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chat');

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