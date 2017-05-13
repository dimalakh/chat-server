const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    conversations: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Conversation'
    }
});

module.exports = mongoose.model('User', UserSchema);