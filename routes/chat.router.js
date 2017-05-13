const express = require('express');
const router = express.Router();

const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

router.get('/conversations', (req, res) => {
    Chat.find().exec((err, conversations) => {
        if (err) res.send(err);
        res.status(200).json(chats);
    });
});

router.post('/conversation', (req, res) => {
    const newConversation = new Conversation ({});
    newChat.save((err, data) => {
        if (err) res.send(err);
        res.status(200).json(data);
    });
});

router.post('/message', (req, res) => {
    const newMessage = new Message ({
        msg: req.body.msg
    });

    newMessage.save((err, message) => {
        if (err) res.send(err);
        res.status(200).json(message);
    });
});

router.get('/message/:id', (req, res) => {
    Message.findOne({ _id: req.params.id })
        .exec((err, message) => {
            if (err) res.send(err);
            res.status(200).json(message);
        });
});

router.delete('/message/:id', (req, res) => {
    Message.findByIdAndRemove({ _id: req.params.id })
        .exec((err) => {
            if (err) res.send(err);
            res.status(200).send(200);
        });
});

router.put('/message/:id', (req, res) => {
    const data = { msg:req.body.msg };
    Message.findOneAndUpdate({ _id: req.params.id }, data)
        .exec((err, message) => {
            if(err) res.send(err);
            res.status(200).send('message updated');
        })
});

module.exports = router;