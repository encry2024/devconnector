const Validator = require('validator');

const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (! Validator.isLength(data.handle, { min:2, max:40 })) {
        errors.handle = 'Handle needs to be at least between 2 and 40'
    }

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle is required';
    }

    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    }

    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Skill field is required';
    }

    if (!isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website = 'Not a valid URL';
        }
    }

    if (!isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid Facebook URL';
        }
    }

    if (!isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid Youtube URL';
        }
    }

    if (!isEmpty(data.linkedIn)) {
        if (!Validator.isURL(data.linkedIn)) {
            errors.linkedIn = 'Not a valid linkedIn URL';
        }
    }

    if (!isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid twitter URL';
        }
    }

    if (!isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid Instagram URL';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}