"use strict";
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const schemas = require("./schemas");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const StrategiesManager = require("./authenticationStrategy/StrategiesManager");
const ObjectId = require("mongodb").ObjectID;
const findOrCreate = require("mongoose-findorcreate");
const userSchema = schemas.userSchema;
const contentSchema = schemas.contentSchema;
const app = express();
const port = 3000;
//full routes on index.js
const indexRoutes  = require("./routes/index")

class App {
  constructor() {
    this.initExpressMiddlewares();
    this.initMongooseConnection();
    this.initPassportAuthentication();
    this.initRoutes();
    this.initListener();
  }

  initExpressMiddlewares() {
    app.use(express.static(__dirname + '/public'));
    app.use("/room", express.static(__dirname + '/public'));
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({extended: true}));

    // Set up session.
    app.use(session({
      secret: "secret",
      resave: false,
      saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());
  }

  initMongooseConnection() {
    mongoose.connect("mongodb://localhost:27017/dkitInterHubDB", {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.set("useCreateIndex", true);
    mongoose.set('useFindAndModify', false);
  }

  initPassportAuthentication() {
    const User = new mongoose.model("User", userSchema);

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    // Set authentication strategies.
    const strategies = [];
    strategies.push(
      StrategiesManager.STRATEGY.LOCAL,
      StrategiesManager.STRATEGY.GOOGLE,
      StrategiesManager.STRATEGY.OUTLOOK,
      StrategiesManager.STRATEGY.FACEBOOK
    )

    const strategiesManager = new StrategiesManager(strategies);
    strategiesManager.useStrategies();
  }

  initRoutes() {
    app.use(indexRoutes);
  }

  initListener() {
    app.listen(port, function() {
      console.log("Server started on port " + port);
    });
  }
}

// Initialize App object to run server.
new App();
