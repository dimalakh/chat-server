const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId
    },
    msg: {
        type: String,
        required: true
    },
    date: { 
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);