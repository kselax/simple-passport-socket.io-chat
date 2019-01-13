const express = require('express');
const router = express.Router();

const passport = require('passport')

router.get('/', (req, res, next) => {

  let error = req.flash('error')
  console.log('error = ', error);
  error = (error && error.length && error[0]) || ''
  console.log('error = ', error);
  res.render('index', { 
    title: 'Log in',
    error: error
  });
});

router.post('/', 
  passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
  }), (req, res, next) => {
    res.redirect('/chat')
  })

module.exports = router;
