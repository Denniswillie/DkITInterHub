"use strict";
//jshint esversion:6
const schemas = require("../../schemas");
const passport = require("passport");
const mongoose = require("mongoose");
const userSchema = schemas.userSchema;
const passportLocalMongoose = require("passport-local-mongoose");
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

class LocalStrategy {
  constructor() {
    passport.use(User.createStrategy());
  }
}

module.exports = LocalStrategy;
