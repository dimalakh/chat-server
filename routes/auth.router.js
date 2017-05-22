const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user.model'); 

router.post('/signup', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        online: false
    });

    newUser.save((err, user) => {
        if (err) res.send(err); 
        res.send(user);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) res.send(err);
        if (user === null) {
            res.sendStatus(404);
        } else {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const token = jwt.sign(user, 'secretKey', { noTimestamp: true });
                res.json({
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        conversations: user.conversations
                    },
                    token,
                    tokenType: 'Bearer'
                });
            } else {
                res.send(401);
            }
        }
    });
});

module.exports = router;