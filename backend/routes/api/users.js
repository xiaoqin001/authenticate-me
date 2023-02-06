const express = require('express');
const asyncHandler = require('express-async-handler');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validationSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid Email'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 4})
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
]

router.post(
    '/',
    validationSignup,
    asyncHandler(async (req, res, next) => {
        const { username, email, password  } = req.body;
        const user = await User.signup({ username, email, password });

        await setTokenCookie(res, user);

        return res.json({ user });
    })
);

module.exports = router;