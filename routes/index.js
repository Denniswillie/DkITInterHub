const express = require("express");
const router  = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const schemas = require("../schemas");
const contentSchema = schemas.contentSchema;
const ContentCard = new mongoose.model("ContentCard", contentSchema);
const authRoutes = require("../routes/auth");

// Setup server requests and responses on different routes.
router.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.render("login");
  }
});

router.get("/dashboard", function(req, res) {
  ContentCard.find({}, function(err, allContents){
     if(err){
         console.log(err);
     } else {

       if (req.isAuthenticated()) {
         res.render("dashboard", {user: req.user, contents:allContents});
       } else {
         res.redirect("/");
       }

     }
  });

});

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

router.get("/createContent", function(req, res){
  res.render("createContent");
})
router.post("/createContent", function(req, res){
  var title = req.body.title;
  var type = req.body.type;
  var content = req.body.content;
  var invitation_url = req.body.invitation_url;

  ContentCard.create({title:title, type:type, content:content, invitation_url:invitation_url}, function(err, theContent){
    if (err){
      console.log(err);
    }else{
      console.log(theContent);
      res.redirect("/dashboard");
    }
  });
});
router.get("/showContents", function(req, res){
  // Get all contents from DB

})

router.use("/auth", authRoutes);

module.exports = router;
