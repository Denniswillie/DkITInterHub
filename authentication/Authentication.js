const session = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const StrategiesManager = require("./StrategiesManager");

function Authentication() {};

Authentication.prototype.initializeSession = function(app, passport) {
  app.use(session({
    secret: "d414d0_f1r1c15",
    resave: false,
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session());
}

Authentication.prototype.addPluginsToUserSchema = function(userSchema) {
  userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);
}

Authentication.prototype.initiateStrategies = function(strategies, passport, userModel) {
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
  strategiesManager.useStrategies();
}

module.exports = Authentication;
