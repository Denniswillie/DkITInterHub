//jshint esversion:6
require('dotenv').config();
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const schemas = require("./schemas");
const Authentication = require("./authentication/Authentication");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const StrategiesManager = require("./authentication/StrategiesManager");
const ObjectId = require("mongodb").ObjectID;
const findOrCreate = require("mongoose-findorcreate");
const userSchema = schemas.userSchema;
const {Storage} = require('@google-cloud/storage');
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

Authentication.prototype.initializeSession(app, passport);

// Set up database connection.
mongoose.connect("mongodb://localhost:27017/dkitInterHubDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

Authentication.prototype.addPluginsToUserSchema(userSchema);

const User = new mongoose.model("User", userSchema);

// Set authentication strategies.
const strategies = [];
strategies.push(
  StrategiesManager.prototype.STRATEGY.GOOGLE,
  StrategiesManager.prototype.STRATEGY.OUTLOOK,
  StrategiesManager.prototype.STRATEGY.FACEBOOK
)

Authentication.prototype.initiateStrategies(strategies, passport, User);

// Authenticate Google Cloud Storage.
const projectId = 'dkitinterhub'
const keyFilename = './DkitInterHub-18ea7da7837a.json'
const storage = new Storage({projectId, keyFilename});

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile"] })
);

app.get('/auth/google/dashboard',
  passport.authenticate('google', { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect dashboard.
    res.redirect('/dashboard');
});

app.get('/auth/outlook',
  passport.authenticate('windowslive', {
    scope: [
      'openid',
      'profile',
      'offline_access',
      'https://outlook.office.com/Mail.Read'
    ]
  })
);

app.get('/auth/outlook/dashboard',
  passport.authenticate('windowslive', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect dashboard.
    res.redirect('/dashboard');
  });

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/dashboard',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect dashboard.
    res.redirect('/dashboard');
  });

// Setup server requests and responses on different routes.
app.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.render("login");
  }
});

app.get("/dashboard", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("dashboard", {nameOfUser: req.user.name, imageUrl: ""});
  } else {
    res.redirect("/");
  }
});

app.post("/userImageProfile", function(req, res) {
  const bucket = storage.bucket('first_test_bucket_dkitinterhub');
  bucket.getFiles(function(err, files) {
    console.log(files);
  });
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.listen(port, function() {
  console.log("Server started on port " + port);
});
