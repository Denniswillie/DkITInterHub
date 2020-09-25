"use strict";
// jshint esversion:6

const GoogleFileStorageManager =
  require("../../../fileStorage/managerTypes/GoogleFileStorageManager");
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

/**
 * This class is responsible for handling user's data in the database
 * for RUD operations. Creating users won't be necessary here since
 * it is done in the authentication system.
 */
class MongoDBUserManager {
  static USER_SCHEMA = new mongoose.Schema({
    username: String,
    googleId: String,
    outlookId: String,
    facebookId: String,
    name: String,
    country: String,
    phoneNumber: String,
    course: String,
    imageUrl: String
  });

  static USERNAME_AVAILABILITY = {
    AVAILABLE: "username is available!",
    UNAVAILABLE: "username is unavailable"
  }

  static async getExistingUser(searchedUsername, ownUsername) {
    const User = new mongoose.model("User", this.USER_SCHEMA;
    User.findOne({
      username: {
        $regex: "^" + username + "$",
        $options: "i"
      }, function(err, foundUser) {
        if (err) {
          console.log(err);
          return;
        }
        return foundUser;
      })
  }
}

module.exports = MongoDBUserManager;
