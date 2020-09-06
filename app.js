//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OutlookStrategy = require('passport-outlook').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const ObjectId = require("mongodb").ObjectID;
const findOrCreate = require("mongoose-findorcreate");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: "d414d0_f1r1c15",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/dkitInterHubDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const ratingSchema = new mongoose.Schema({
  rate: Number,
  description: String
});

const itemSchema = new mongoose.Schema({
  merchantStoreId: ObjectId,
  name: String,
  price: Number,
  image: String,
  description: String
});

const storeSchema = new mongoose.Schema({
  creatorId: ObjectId,
  items: [itemSchema]
});

const userSchema = new mongoose.Schema({
  googleId: String,
  outlookId: String,
  facebookId: String,
  name: String,
  country: String,
  rating: ratingSchema,
  store: storeSchema,
  phoneNumber: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/dashboard",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      console.log(profile);
      return cb(err, user);
    });
  }
));

// Outlook strategy
passport.use(new OutlookStrategy({
    clientID: process.env.OUTLOOK_CLIENT_ID,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/outlook/dashboard"
  },
  function(accessToken, refreshToken, profile, done) {
    var user = {
      outlookId: profile.id,
      name: profile.DisplayName,
      email: profile.EmailAddress,
      accessToken:  accessToken
    };
    if (refreshToken)
      user.refreshToken = refreshToken;
    if (profile.MailboxGuid)
      user.mailboxGuid = profile.MailboxGuid;
    if (profile.Alias)
      user.alias = profile.Alias;
    User.findOrCreate({ outlookId: profile.id }, function (err, user) {
      console.log(profile);
      return done(err, user);
    });
  }
));

// Facebook strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/dashboard"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      console.log(profile);
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res) {
  res.render("login");
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ["profile", "email"] })
);

app.get('/auth/google/dashboard',
  passport.authenticate('google', { failureRedirect: "/login" }),
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
  passport.authenticate('windowslive', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/dashboard',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

app.get("/dashboard", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("dashboard");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
