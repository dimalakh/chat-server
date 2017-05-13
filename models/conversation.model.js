const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId,  ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    date: { 
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conversation', ConversationSchema);