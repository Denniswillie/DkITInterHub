const schemas = require("../schemas");
const mongoose = require("mongoose");
const contentSchema = schemas.contentSchema;
const ContentCard = new mongoose.model("ContentCard", contentSchema);
const commentSchema = schemas.commentSchema;
const Comment     = new mongoose.model("Comment", commentSchema);

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkContentCardOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        ContentCard.findById(req.params.contentCard_id, function(err, foundContent){
           if(err || !foundContent){

               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundContent.creatorId.equals(req.user._id)) {
                next();
            } else {

                res.redirect("back");
            }
           }
        });
    } else {

        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){

               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.creatorId.equals(req.user._id)) {
                next();
            } else {

                res.redirect("back");
            }
           }
        });
    } else {

        res.redirect("back");
    }
}



module.exports = middlewareObj;
