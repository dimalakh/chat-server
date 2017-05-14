const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    msg: {
        type: String,
        required: true
    },
    date: { 
        type: Number,
        default: Date.now()
    }
});

module.exports = mongoose.model('Message', messageSchema);