const express = require('express');
const router = express.Router();

const User = require('../models/user.model');
const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

//get user conversations
router.get('/:userId', (req, res) => {
    User.findOne({ _id: req.params.userId})
    .exec((err, user) => {
        Conversation.find({ _id: {$in: user.conversations}})
        .exec((err, conversation) => {
            res.send(conversation);
        });
    });
});

// get messages by conversation id
router.get('/conversation/:id', (req, res) => {
    Conversation.findOne({ _id: req.params.id})
    .populate('messages')
    .exec((err, conversation) => {
        Message.find({ _id: {$in: conversation.messages }})
        .populate('sender','username')
        .exec((err, messages) => {
            res.send(messages);
        });
    });
});

// create new conversation
router.post('/conversation', (req, res) => {
    const newConversation = new Conversation({
        users: req.body.userId
    });
    newConversation.save((err, conversation) => {
        if (err) res.send(err); 
        res.send(conversation);
        User.findOne({ _id: req.body.userId })
        .exec((err, user) => {
            user.conversations.push(conversation._id);
            user.save();
        });
    });;
});

module.exports = router;