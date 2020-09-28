"use strict";
//jshint esversion:6
require('dotenv').config();
const Strategy = require('passport-google-oauth20').Strategy;
const schemas = require("../../schemas");
const passport = require("passport");
const mongoose = require("mongoose");
const userSchema = schemas.userSchema;
const findOrCreate = require("mongoose-findorcreate");
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

class GoogleStrategy {
  constructor() {
    passport.use(new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/dashboard",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
          googleId: profile.id,
          name: profile.displayName
        }, function(err, user) {
          return cb(err, user);
        });
      }
    ));
  }
}

module.exports = GoogleStrategy;
