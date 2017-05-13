const mongoose = require('mongoose');

const ConversationSchema = mongoose.Schema({
    users: [{
        type: mongoose.Schema.ObjectId
    }],
    messages: [{
        type: mongoose.Schema.ObjectId
    }],
    date: { 
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conversation', ConversationSchema);