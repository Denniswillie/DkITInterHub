const express = require("express");
const router  = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const schemas = require("../schemas");
const contentSchema = schemas.contentSchema;
const ContentCard = new mongoose.model("ContentCard", contentSchema);
const userSchema = schemas.userSchema;
const roomSchema = schemas.roomSchema;
const Room = new mongoose.model("Room", roomSchema);
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
  if (req.isAuthenticated()) {
    if (req.user.username == undefined) {
      res.redirect("/userProfileInput");
    } else {
      ContentCard.find({}, function(err, allContents) {
        const fileName = req.user._id + ".img";
        const file = bucket.file(fileName);
        createOrUpdateUserProfileImage(req, file)
           .then(res.render("dashboard", {user: req.user, contents:allContents}))
           .catch((err) => console.log(err));
      });
    }
  } else {
    res.redirect("/");
  }
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

router.get("/userProfileInput", function(req, res) {
  res.render("userProfileInput");
});

router.post("/usernameAvailabilityChecker", function(req, res) {
  const username = req.body.username;
  const User = new mongoose.model("User", userSchema);
  User.find({username: { $regex: username, $options: "i" }}, function(err, foundUser) {
    if (err) {
      console.log(err);
      return;
    }
    else if (foundUser.length == 0) {
      res.send("Username is available!");
    }
    else {
      res.send("Username not available!");
    }
  });
});

router.post("/userProfileInput", function(req, res) {
  const username = req.body.username;
  const country = req.body.country;
  const course = req.body.course;
  const User = new mongoose.model("User", userSchema);
  User.findOneAndUpdate({_id: req.user._id}, {username: username, country: country, course: course}, function(err, foundUser) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/dashboard");
    }
  });
});

router.get("/createRoom", function(req, res) {
  res.render("createRoom");
});

router.post("/existingUsers", function(req, res) {
  const User = new mongoose.model("User", userSchema);
  const startingLettersRegex = "^" + req.body.inputElement;
  User.find({$and: [{username: {$regex: startingLettersRegex, $options: "i"}}, {username: {$not: {$eq: req.user.username}}}]}, function(err, foundUsers) {
    if (err) {
      console.log(err);
    } else {
      res.send(foundUsers);
    }
  })
  .limit(5);
});

router.post("/createRoom", function(req, res) {

});

router.use("/auth", authRoutes);

module.exports = router;
