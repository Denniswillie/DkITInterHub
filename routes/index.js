const express = require("express");
const router  = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const schemas = require("../schemas");
const contentSchema = schemas.contentSchema;
const ContentCard = new mongoose.model("ContentCard", contentSchema);
const commentSchema = schemas.commentSchema;
const Comment     = new mongoose.model("Comment", commentSchema);
const authRoutes    = require("../routes/auth");
const ObjectId = require("mongodb").ObjectID;
const middleware = require("../middleware");

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
     } else {

       if (req.isAuthenticated()) {
         console.log(req.user);
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
  var creatorId = req.user._id;
  var dateCreated = new Date();



  ContentCard.create({title:title, type:type, content:content,
    invitation_url:invitation_url, dateCreated:dateCreated, creatorId:creatorId, comments:[]}, function(err, theContent){
    if (err){
      console.log(err);
    }else{
      console.log(theContent);
      res.redirect("/dashboard");
    }
  });
});
router.get("/:contentCard_id", function(req, res){
  ContentCard.findById(req.params.contentCard_id).populate("comments").exec(function(err, foundContent){
    if(err){
      console.log(err);
    }else{
      console.log(foundContent);

      res.render("contentCard", {content:foundContent});
    }

  });
});

router.post("/:contentCard_id/edit", middleware.checkContentCardOwnership, function(req, res){
  ContentCard.findByIdAndUpdate(req.params.contentCard_id, {title:req.body.title, type:req.body.type,
    content:req.body.content, invitation_url:req.body.invitation_url}, function(err, updatedCampground){
       if(err){
           res.redirect("back");
       } else {
           //redirect somewhere(show page)
           res.redirect("/"+ req.params.contentCard_id);
       }
    });
  });
  router.post("/:contentCard_id/delete", middleware.checkContentCardOwnership, function(req, res){
    ContentCard.findByIdAndRemove(req.params.contentCard_id, function(err){
      if(err){
        console.log(err);
      }else{
        res.redirect("/dashboard");
      }
    })
  });
router.get("/:contentCard_id/edit", function(req, res){
  ContentCard.findById(req.params.contentCard_id, function(err, foundContent){
    if(err){
      console.log(err);
      res.redirect("back");

    }else {
      res.render("editContent", {content:foundContent});
    }

  });
});
router.post("/:contentCard_id/createComment", function(req, res){
  ContentCard.findById(req.params.contentCard_id, function(err, foundContent){
    var creatorId = ObjectId(req.user._id);
    var comment_content = req.body.comment_content;
    var dateCreated = new Date();
    var interval = timeSince(dateCreated);
    Comment.create({creatorId:creatorId, comment_content:comment_content,
      dateCreated:dateCreated, interval:interval}, function(err, foundComment){
      if(err){

        res.redirect("back");
      }else{
        console.log(foundComment);
        foundContent.comments.push(foundComment);
        foundContent.save();
        res.redirect("/"+ req.params.contentCard_id);
      }
    });
  });
});

// COMMENT UPDATE
router.post("/:contentCard_id/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, {content:req.body.comment_content}, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/" + req.params.contentCard_id);
      }
   });
});

// COMMENT DESTROY ROUTE
router.post("/:contentCard_id/:comment_id/delete", middleware.checkCommentOwnership, function(req, res){

    //findByIdAndRemove
    ContentCard.findById(req.params.contentCard_id, function(err, foundContent){
      if(err){

        res.redirect("back");
      }else{
        Comment.findByIdAndRemove(req.params.comment_id, function(err){
           if(err){

               res.redirect("back");
           } else {
                var comments = foundContent.comments
                id=Number(req.params.comment_id);
                var index = comments.map(x => {
                  return x._id;
                }).indexOf(id);
                foundContent.comments.splice(index, 1);
                foundContent.save();
                console.log(foundContent.comments);
               res.redirect("/"+ req.params.contentCard_id);
           }
        });
      }
    });

});


router.use("/auth", authRoutes);

module.exports = router;
