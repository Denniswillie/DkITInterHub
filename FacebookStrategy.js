//jshint esversion:6
require('dotenv').config();
const FacebookStrategy = require('passport-facebook').Strategy;

function useStrategy(passport, userModel) {
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/dashboard"
    },
    function(accessToken, refreshToken, profile, cb) {
      userModel.findOrCreate({
        facebookId: profile.id,
        name: profile.displayName
      }, function(err, user) {
        return cb(err, user);
      });
    }
  ));
}

module.exports.useStrategy = useStrategy;
