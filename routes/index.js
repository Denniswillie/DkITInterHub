const express = require("express");
const router  = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const schemas = require("../schemas");
const contentSchema = schemas.contentSchema;
const ContentCard = new mongoose.model("ContentCard", contentSchema);
const commentSchema = schemas.commentSchema;
const Comment = new mongoose.model("Comment", commentSchema);
const userSchema = schemas.userSchema;
const authRoutes = require("../routes/auth");
const {Storage} = require('@google-cloud/storage');
const multer  = require('multer')
const upload = multer({ dest: '../userProfileImage' });

// Authenticate google cloud storage client and create bucket.
const projectId = 'dkitinterhub'
const keyFilename = '../DkitInterHub-18ea7da7837a.json'
const storage = new Storage({projectId, keyFilename});
const bucket = storage.bucket('first_test_bucket_dkitinterhub');
// function for interval e.g: 4 minutes ago
function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}
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
       const fileName = req.user._id + ".img";
       const file = bucket.file(fileName);
       createOrUpdateUserProfileImage(req, file)
          .then(res.render("dashboard", {user: req.user, contents:allContents}))
          .catch((err) => console.log(err));
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

router.post("/:id/createComment", function(req, res){
  ContentCard.findById(req.params.id, function(err, foundContent){
    var creatorId = req.user._id;
    var content = req.body.content;
    var dateCreated = new Date();
    var interval = timeSince(dateCreated);
    Comment.create({creatorId:creatorId, content:content, dateCreated:dateCreated, interval:interval}, function(err, foundComment){
      if(err){
        console.log(err);
      }else{
        console.log(foundComment);
        foundContent.comments.push(foundComment);
        foundContent.save();
        res.redirect("/dashboard");
      }
    });
  });
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

router.post("/userProfileImage", upload.single('userProfileImage'), function(req, res) {
  const destination = req.user._id + ".img";
  const options = {
    destination: destination,
    resumable: true,
    validation: 'crc32c'
  };

  bucket.upload(req.file.path, options, function(err, file) {
    createOrUpdateUserProfileImage(req, file)
        .then(res.redirect("/"))
        .catch((err) => console.log(err));
  });
});

async function createOrUpdateUserProfileImage(req, file) {
  const config = {
    action: "read",
    expires: '12-31-9999'
  }
  const User = new mongoose.model("User", userSchema);
  await file.getSignedUrl(config, function(err, url) {
    if (err) {
      console.error(err);
      return;
    }
    User.findOneAndUpdate({_id: req.user._id}, {imageUrl: url}, function(err, foundUser) {
      if (err) {
        console.log(err);
        return;
      }
    });
  });
}

router.use("/auth", authRoutes);

module.exports = router;
