const express = require('express');
const router = express.Router();

const User = require('../models/user.model');

router.get('/', (req, res) => {
    User.find({}, { password: 0, conversations: 0 })
        .exec((err, users) => {
            if(err) res.send(err);
            res.status(200).json(users);
        });
})

router.get('/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .exec((err, user) => {
            if(err) res.send(err);
            res.status(200).json(user);
        });
});

router.put('/:id', (req, res) => {
    const data = {
       username: req.body.username,
       email: req.body.email,
       password: req.body.password
    }
    console.log(data);
    User.findOneAndUpdate({ _id: req.params.id }, data)
        .exec((err, user) => {
            if(err) res.send(err);
            res.status(200).json(user);
        });
});

module.exports = router;