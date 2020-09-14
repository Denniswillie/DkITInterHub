const express = require("express");
const router  = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const schemas = require("../schemas");
const contentSchema = schemas.contentSchema;
const ContentCard = new mongoose.model("ContentCard", contentSchema);
const userSchema = schemas.userSchema;
const authRoutes = require("../routes/auth");
const {Storage} = require('@google-cloud/storage');
const multer  = require('multer')
const upload = multer({ dest: '../userProfileImage' });

// Authenticate google cloud storage client and create bucket.
const projectId = 'dkitinterhub'
const keyFilename = './DkitInterHub-18ea7da7837a.json'
const storage = new Storage({projectId, keyFilename});
const bucket = storage.bucket('first_test_bucket_dkitinterhub');

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
     }
     else if (req.isAuthenticated()) {
       res.render("dashboard", {user: req.user, contents:allContents});
     }
     else {
       res.redirect("/");
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

router.post("/userProfileImage", upload.single('userProfileImage'), function(req, res) {
  const destination = req.user._id + ".png";
  const options = {
    destination: destination,
    resumable: true,
    validation: 'crc32c',
    metadata: {
      metadata: {
        event: 'test image uploaded to google cloud storage'
      }
    }
  };

  const config = {
    action: "read",
    expires: '03-17-2025'
  }

  bucket.upload(req.file.path, options, function(err, file) {
    const User = new mongoose.model("User", userSchema);
    file.getSignedUrl(config, function(err, url) {
      if (err) {
        console.error(err);
        return;
      }
      User.findOneAndUpdate({_id: req.user._id}, {imageUrl: url}, function(err, foundUser) {
        if (err) {
          console.log(err);
          return;
        } else {
          res.redirect("/");
        }
      });
    });
  });
});

router.use("/auth", authRoutes);

module.exports = router;
