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
      $and: [
        {
          username: {
            $regex: "^" + searchedUsername + "$",
            $options: "i"
          }
        },
        {
          username: {
            $not: {
              $eq: ownUsername
            }
          }
        }
      ]
    }, function(err, foundUser) {
      if (err) {
        console.log(err);
        return;
      }
      return foundUser;
    });
  }

  /**
  * This function has to make sure that the result put the matched username
  * in the front of the foundUsers list and doesn't include the requester
  * username.
  */
  static async getExistingUsersWithStartingLetters(
      startingLetters, matchedUser, ownUsername) {
    User.find({
      $and: [
        {
          username: {
            $regex: "^" + startingLetters,
            $options: "i"
          }
        },
        {
          username: {
            $not: {
              $eq: ownUsername
            }
          }
        },
        {
          username: {
            $not: {
              $eq: 
            }
          }
        }
      ]
    })
  }
}

module.exports = MongoDBUserManager;
