const express = require('express');
const router = express.Router();

const User = require('../models/user'); 

router.get('/signup', (req, res) => {
    res.send('signup');
});

router.get('/login', (req, res) => {
    res.send('login');
});

router.post('/signup', (req, res) => {
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    req.checkBody('username', 'name is required').notEmpty();
    req.checkBody('email', 'must be an email').isEmail();
    req.checkBody('password', 'must be an email').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        console.log('errors' + errors);
    } else {
        const newUser = new User({
            'username': name,
            'password': password,
            'email': email
        });

        User.createUser(newUser, (err, user) => {
            if(err) throw err;
            console.log(user);
        });
    }

});

module.exports = router;