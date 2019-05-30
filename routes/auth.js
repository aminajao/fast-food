const express = require('express');
const { check, body } = require('express-validator/check');

const router = express.Router();

const authController = require('../controllers/auth');



router.get('/login', authController.getLogin);

router.post('/login', 
[
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.').normalizeEmail(),
    body('password', 'Password must be at least 6 characters.')
      .isLength({ min: 6 })
  ]
, authController.postLogIn);

router.get('/signup', authController.getSignUp);

router.post('/signup',
    [
        check('email').isEmail().withMessage('Please enter a valid email address!').normalizeEmail(),
        body('password', 'Password must be at least 6 characters').isLength({min: 6}),

        body('confirmPassword').trim().custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
          }
          return true;
        })

    ],
    authController.postSignUp);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;