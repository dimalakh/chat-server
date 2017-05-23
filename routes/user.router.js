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

router.put('/image', (req, res) => {
    const data = {
       image: req.body.imgUrl,
    }
    console.log(data);
    User.findOneAndUpdate({ _id: req.body.userId }, data)
        .exec((err, user) => {
            if(err) res.send(err);
            res.status(200).json(user);
        });
});

module.exports = router;