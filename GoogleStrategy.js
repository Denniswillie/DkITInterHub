//jshint esversion:6
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function useStrategy(passport, userModel) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/dashboard",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
      userModel.findOrCreate({
        googleId: profile.id,
        name: profile.displayName
      }, function(err, user) {
        return cb(err, user);
      });
    }
  ));
}

module.exports.useStrategy = useStrategy;
