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
        default: 'http://www.manitoulinmall.com/wp-content/themes/simply-responsive-cp-1351/images/no-thumb-250.jpg'
    },
    conversations: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Conversation'
    }
});

module.exports = mongoose.model('User', UserSchema);