var express = require("express");
var app  = express.Router();
var passport = require("passport");

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
    res.render("dashboard", {user: req.user});
  } else {
    res.redirect("/");
  }
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});


module.exports = app;
