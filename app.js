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
const contentSchema = schemas.contentSchema;
const app = express();
const port = 3000;
//full routes on index.js
const indexRoutes  = require("./routes/index")

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

Authentication.prototype.initializeSession(app, passport);

// Set up database connection.
mongoose.connect("mongodb://localhost:27017/dkitInterHubDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

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

app.use(indexRoutes);

app.listen(port, function() {
  console.log("Server started on port " + port);
});
