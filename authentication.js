const schemas = require("./schemas");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const userSchema = schemas.userSchema;
const StrategiesManager = require("./StrategiesManager");

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

function initiateStrategies(userModel, strategies) {
  passport.use(userModel.createStrategy());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    userModel.findById(id, function(err, user) {
      done(err, user);
    });
  });
  strategiesManager = new StrategiesManager(strategies, passport, userModel);
}

module.exports.initializeSession = initializeSession;
module.exports.addPluginsToUserSchema = addPluginsToUserSchema;
