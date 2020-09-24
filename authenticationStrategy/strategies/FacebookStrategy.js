"use strict";
//jshint esversion:6
require('dotenv').config();
const Strategy = require('passport-facebook').Strategy;
const schemas = require("../../schemas");
const passport = require("passport");
const mongoose = require("mongoose");
const userSchema = schemas.userSchema;
const findOrCreate = require("mongoose-findorcreate");
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

class FacebookStrategy {
  constructor() {
    passport.use(new Strategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/dashboard"
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
          facebookId: profile.id,
          name: profile.displayName
        }, function(err, user) {
          return cb(err, user);
        });
      }
    ));
  }
}

module.exports = FacebookStrategy;
