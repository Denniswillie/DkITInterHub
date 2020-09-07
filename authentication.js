const schemas = require("./schemas");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OutlookStrategy = require('passport-outlook').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const ObjectId = require("mongodb").ObjectID;
const findOrCreate = require("mongoose-findorcreate");
const userSchema = schemas.userSchema;

function initializeSession(app) {
  app.use(session({
    secret: "d414d0_f1r1c15",
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}

function addPluginsToUserSchema(userSchema) {
  userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);
}

module.exports.initializeSession = initializeSession;
module.exports.addPluginsToUserSchema = addPluginsToUserSchema;
