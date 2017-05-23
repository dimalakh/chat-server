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
    online: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: 'https://pbs.twimg.com/profile_images/852416028051197952/srTQTCQN_bigger.jpg'
    },
    conversations: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Conversation'
    }
});

module.exports = mongoose.model('User', UserSchema);