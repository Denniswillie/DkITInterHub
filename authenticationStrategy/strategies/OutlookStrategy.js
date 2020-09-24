"use strict";
//jshint esversion:6
require('dotenv').config();
const Strategy = require('passport-outlook').Strategy;
const schemas = require("../../schemas");
const passport = require("passport");
const mongoose = require("mongoose");
const userSchema = schemas.userSchema;
const findOrCreate = require("mongoose-findorcreate");
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

class OutlookStrategy {
  constructor() {
    passport.use(new Strategy({
        clientID: process.env.OUTLOOK_CLIENT_ID,
        clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/outlook/dashboard'
      },
      function(accessToken, refreshToken, profile, done) {
        var user = {
          outlookId: profile.id,
          name: profile.DisplayName,
          email: profile.EmailAddress,
          accessToken: accessToken
        };
        if (refreshToken)
          user.refreshToken = refreshToken;
        if (profile.MailboxGuid)
          user.mailboxGuid = profile.MailboxGuid;
        if (profile.Alias)
          user.alias = profile.Alias;
        User.findOrCreate({
            outlookId: profile.id,
            name: profile.displayName
          },

          function(err, user) {
            return done(err, user);
          });
      }
    ));
  }
}

module.exports = OutlookStrategy;
