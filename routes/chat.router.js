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

// get  messages by conversation id
router.get('/conversation/:id', (req, res) => {
    Conversation.findOne({ _id: req.params.id})
    .populate('messages')
    .exec((err, conversation) => {
        Message.find({ _id: {$in: conversation.messages }})
        .populate({
            path: 'sender',
            select: 'username'
        })
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
// router.get('/conversations', (req, res) => {
//     Conversation.find().exec((err, conversations) => {
//         if (err) res.send(err);
//         res.status(200).json(conversations);
//     });
// });

// router.post('/conversation', (req, res) => {
//     const newConversation = new Conversation ({});
//     newConversation.save((err, data) => {
//         if (err) res.send(err);
//         User.findOne({_id: '5916f46068ad8f07a2472b03'})
//         .exec((err, user) => {
//             user.conversations.push(newConversation);
//             user.save();
//         });
//         res.status(200).json(data);
//     });
// });

// router.post('/message', (req, res) => {
//     const newMessage = new Message ({
//         msg: req.body.msg
//     });

//     newMessage.save((err, message) => {
//         if (err) res.send(err);
//         res.status(200).json(message);
//     });
// });

// router.get('/message/:id', (req, res) => {
//     Message.findOne({ _id: req.params.id })
//         .exec((err, message) => {
//             if (err) res.send(err);
//             res.status(200).json(message);
//         });
// });

// router.delete('/message/:id', (req, res) => {
//     Message.findByIdAndRemove({ _id: req.params.id })
//         .exec((err) => {
//             if (err) res.send(err);
//             res.status(200).send(200);
//         });
// });

// router.put('/message/:id', (req, res) => {
//     const data = { msg:req.body.msg };
//     Message.findOneAndUpdate({ _id: req.params.id }, data)
//         .exec((err, message) => {
//             if(err) res.send(err);
//             res.status(200).send('message updated');
//         })
// });

module.exports = router;