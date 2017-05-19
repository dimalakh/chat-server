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
        .populate('messages')
        .populate('users', '-password -conversations -_v -email')
        .exec((err, conversations) => {
            const tempConversations = [];

            conversations.forEach( conv => {
                const msgsNumber = conv.messages.length,
                      lastMessage = conv.messages[msgsNumber - 1];
                const usersnameArr = conv.users.map(user => {
                    return user.username;
                });

                const newConv = {
                    _id: conv._id,
                    users: usersnameArr,
                    lastMsg: lastMessage
                }

                tempConversations.push(newConv);
            });
            res.json(tempConversations);
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
            res.json(messages);
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
        User.findOne({ _id: req.body.userId })
        .exec((err, user) => {
            user.conversations.push(conversation._id);
            user.save();
        });
        
        res.json(conversation);
    });;
});

module.exports = router;