const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
    users: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message' 
    }],
    lastMsg: {
        date: {
            type: Number,
            default: 0
        },
        msg: {
            type: String,
            dafault: ''
        }
    }
});

module.exports = mongoose.model('Conversation', ConversationSchema);