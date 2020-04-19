const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../../models/User');

// @route   GET     /api/users/test
// @desc    Tests   users route
// @access  Public
router.get('/test',
    (
        req,
        res
    ) => res.json({
        msg: "Users Works"
    })
);

// @route   POST    /api/users/test
// @desc    Register User
// @access  Public
router.post('/register',
    (
        req,
        res
    ) => {
        User.findOne(
            {
                email: req.body.email
            }
        ).then(user => {
            if (user) {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                })
            } else {
                return res.status(400).json({email: 'E-mail already exists'});
            }
        })
    }
);

module.exports = router;