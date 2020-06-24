const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');

// Load profile model
const Profile = require('../../models/Profile');
// Load user model
const User = require('../../models/User');

// @route   GET     /api/profile/test
// @desc    Tests   profile route
// @access  Public
router.get('/test',
    (
        req,
        res
    ) => res.json(
        {
            msg: "Profile Works"
        }
    )
);

// @route   GET     /api/profile/test
// @desc    GET     current users profile
// @access  Public
router.get('/',
    passport.authenticate('jwt', { session: false } ), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id }).then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';

            return res.status(404).json(errors);
        }

        res.json(profile);
    }).catch(error => res.status(404).json(error));
});

// @route   GET     /api/profile
// @desc    GET     Create or Edit users profile
// @access  Public
router.post('/',
    passport.authenticate('jwt', { session: false } ), (req, res) => { // Protective Route
        const { errors, isValid } = validateProfileInput(req.body);
        const profileFields = {};
        profileFields.user = req.user.id;

        if (! isValid) {
            return res.status(400).json(errors);
        }

        // Get fields
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
        // Skills - split into array
        if ( typeof req.body.handle != 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }
        // Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedIn) profileFields.social.linkedIn = req.body.linkedIn;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                if (profile) {
                    profile.findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profileFields },
                        { new: true }
                    )
                    .then(profile => res.json(profile));
                } else {
                    Profile.findOne({ handle: profileFields.handle }).then(profile => {
                        if (profile) {
                            errors.handle = 'That handle already exists.';
                            res.status(400).json(errors);
                        }

                        new Profile(profileFields).save().then(profile => res.json(profile));
                    })
                }
            })
    });

module.exports = router;