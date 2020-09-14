const express = require("express");
const router  = express.Router();
const passport = require("passport");

router.get('/google',
  passport.authenticate('google', { scope: ["profile"] })
);

router.get('/google/dashboard',
  passport.authenticate('google', { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect dashboard.
    res.redirect('/dashboard');
});

router.get('/outlook',
  passport.authenticate('windowslive', {
    scope: [
      'openid',
      'profile',
      'offline_access',
      'https://outlook.office.com/Mail.Read'
    ]
  })
);

router.get('/outlook/dashboard',
  passport.authenticate('windowslive', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect dashboard.
    res.redirect('/dashboard');
  });

router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/dashboard',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect dashboard.
    res.redirect('/dashboard');
  });
module.exports = router;
