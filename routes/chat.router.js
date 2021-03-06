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
            const convArray = conversations.map( conv => {
                    const msgsNumber = conv.messages.length;
                    let lastMessage = conv.messages[msgsNumber - 1];
                    if(lastMessage === undefined) {
                        lastMessage = {
                            date: 0,
                            msg: ''
                        }
                    }
                    return { 
                        _id: conv._id,
                        lastMsg: lastMessage,
                        users: conv.users 
                    }
                });
            res.json(convArray);
        });
    });
});

// get messages by conversation id
router.get('/conversation/:id/:fromDate', (req, res) => {
    Conversation.findOne({ _id: req.params.id})
    .populate('messages')
    .exec((err, conversation) => {
        Message.find({ _id: {$in: conversation.messages }, date: { $gt: req.params.fromDate, $lt: Date.now() } })
        .populate('sender username')
        .exec((err, messages) => {
            res.json(messages);
        });
    });
});

// create new conversation
router.post('/conversation', (req, res) => {
    const newConversation = new Conversation({
        users: req.body.usersIds,
        lastMsg: {
            date: 0,
            msg: ''
        }
    });
    
    Conversation.find({ users: req.body.usersIds}).exec((err, arr) => {
        console.log(arr);
        if(arr.length === 0) {
            newConversation.save((err, conversation) => {
                if (err) res.send(err); 
                req.body.usersIds.forEach(userId => {
                    User.findOne({ _id: userId })
                    .exec((err, user) => {
                        user.conversations.push(conversation._id);
                        user.save();
                    });
                });
                Conversation.findOne({ _id: conversation._id })
                    .populate('users', '-conversations -password')
                    .exec((err, conv) => {
                         res.json(conv);
                    })
            });
        } else {
            res.send(400);
        }
    });

    /*newConversation.save((err, conversation) => {
        if (err) res.send(err); 
        req.body.usersIds.forEach(userId => {
            User.findOne({ _id: userId })
            .exec((err, user) => {
                user.conversations.push(conversation._id);
                user.save();
            });
        })
        res.json(conversation);
    });*/
});

module.exports = router;