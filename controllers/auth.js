const express = require('express');
const passport = require('../config/ppConfig');
const router = express.Router();

//import database
const db = require('../models');

router.get('/signup', (req, res) => {
  res.render('auth/signup');//this is a form
});

router.get('/login', (req, res) => {
  res.render('auth/login');//this is a form
});


router.get('/logout', (req, res)=> {
  req.logOut(); //logs the user out of the session
  req.flash('success, Loggin out... See you next time!');
  res.redirect('/');
});


//
router.post('/signup', (req, res)=> {
  //we now have access to the user info(req.body);
  console.log(req.body)
  const { email, name, password } = req.body; // goes and gives us access to whatever key/value inside of the object req.body
  db.user.findOrCreate({
    where: { email },
    defaults: { name, password }
  })
  .then(([user, created])=> {
    if (created) {
      // if created, succress and we will redirect back to / page
      console.log(`${user.name} was created....`);
      //flash messages
      const successObject = { 
        successRedirect: '/', 
        successFlash: `Welcome ${user.name}. Account was created and logging in...`
      }
      //passport authenticate
      passport.authenticate('local', successObject)(req, res);
    } else {
      // send back email already exists
      req.flash('error', 'Email already exists')
      res.redirect('/auth/signup')
    }
  })
  .catch(error => {
    console.log('******ERROR*******')
    console.log(error);
    req.flash('Error, Either email or password is incorrect. Please try again.')
    res.redirect('/auth/signup');
  });
});



router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'Welcome back ...',
  failureFlash: 'Either email or password is incorrect' 
}));



module.exports = router;