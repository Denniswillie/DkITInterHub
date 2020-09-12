var express = require("express");
var app  = express.Router();
const mongoose = require("mongoose");
var passport = require("passport");
var schemas = require("../schemas");
var contentSchema = schemas.contentSchema;
var Content = new mongoose.model("Content", contentSchema);


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

app.get("/createContent", function(req, res){
  res.render("createContent");
})
app.post("/createContent", function(req, res){
  var title = req.body.title;
  var type = req.body.type;
  var content = req.body.content;
  var invitation_url = req.body.invitation_url;

  Content.create({title:title, type:type, content:content, invitation_url:invitation_url}, function(err, theContent){
    if (err){
      console.log(err);
    }else{
      console.log(theContent);
      res.redirect("/showContents");
    }
  });
});
app.get("/showContents", function(req, res){
  // Get all contents from DB
    Content.find({}, function(err, allContents){
       if(err){
           console.log(err);
       } else {
          res.render("contents",{contents:allContents});
       }
    });
})

module.exports = app;
