"use strict";
// jshint esversion:6

const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

/**
 * This class is responsible for handling user's data in the database
 * for CRUD operations.
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
    course: String
  });

  const User = new mongoose.model("User", this.USER_SCHEMA);

  static USERNAME_AVAILABILITY = {
    AVAILABLE: "username is available!",
    UNAVAILABLE: "username is unavailable"
  }

  static async getUserWithSpecifiedUsername(searchedUsername) {
    User.find({})
        .where('username').regex('/^' + searchedUsername + '$/i')
        .where('username').ne(this._user.username);
        .limit(1)
        .exec(function(err, foundUser) {
          if (err) {
            console.log(err);
            return;
          } else {
            return foundUser;
          }
        });
  }

  static async getUsersWithStartingLetters(startingLetters) {
    User.find({})
        .where('username').regex('/^' + startingLetters + '/i')
        .where('username').ne(this._user.username)
        .exec(function(err, foundUsers) {
          if (err) {
            console.log(err);
            return;
          } else {
            return foundUsers;
          }
        });
  }
}

module.exports = MongoDBUserManager;
