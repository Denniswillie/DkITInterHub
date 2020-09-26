"use strict";
// jshint esversion:6

const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

/**
 * This class is responsible for handling user's data in the database
 * for RUD operations. Create operations won't be necessary here since
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
    course: String
  });

  const User = new mongoose.model("User", this.USER_SCHEMA);

  static USERNAME_AVAILABILITY = {
    AVAILABLE: "username is available!",
    UNAVAILABLE: "username is unavailable"
  }

  static USER_PROPERTY = {
    USERNAME: 'username',
    NAME: 'name',
    COUNTRY: 'country',
    PHONE_NUMBER: 'phoneNumber',
    COURSE: 'course'
  }

  static async getUserWithSpecifiedUsername(searchedUsername) {
    User.find({})
        .where(this.USER_PROPERTY.USERNAME).regex('/^' + searchedUsername + '$/i')
        .where(this.USER_PROPERTY.USERNAME).ne(this._user.username);
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
        .where(this.USER_PROPERTY.USERNAME).regex('/^' + startingLetters + '/i')
        .where(this.USER_PROPERTY.USERNAME).ne(this._user.username)
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
