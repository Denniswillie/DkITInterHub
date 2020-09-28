"use strict";
// jshint esversion:6

const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;
const RoomClass = require("./Room");
const userSchema = require("../user/MongoDBUserManager").USER_SCHEMA;

  /**
   * This class is responsible for handling rooms data in the database
   * for CRUD operations.
   */
  class MongoDBRoomManager {

    static ROOM_SCHEMA = new mongoose.Schema({
      creatorId: ObjectId,
      name: String,
      description: String,
      listOfStudents: [ObjectId],
      privacyType: String,
      accessRequests: [ObjectId]
    });

    const Room = new mongoose.model("Room", ROOM_SCHEMA);

    static async getRoomWithSpecifiedUsername(searchedUsername) {
      Room.find({})
        .where(RoomClass.PROPERTY.NAME).regex('/^' + searchedUsername + '$/i')
        .limit(1)
        .exec(function(err, foundRoom) {
          if (err) {
            console.log(err);
            return;
          } else {
            return foundRoom;
          }
        })
    }

    static async getRoomsWithStartingLetters(startingLetters) {
      Room.find({})
        .where(RoomClass.PROPERTY.NAME).regex('/^' + startingLetters + '/i')
        .exec(function(err, foundRooms) {
          if (err) {
            console.log(err);
          } else {
            return foundRooms;
          }
        });
    }

    static async createRoom(roomObject) {
      Room.create({
        creatorId: roomObject.creatorId,
        name: roomObject.name,
        description: roomObject.description,
        listOfStudents: roomObject.listOfStudents,
        privacyType: roomObject.privacyType
      }, function(err, createdRoom) {
        if (err) {
          console.log(err);
          return;
        } else {
          return createdRoom;
        }
      });
    }

    static async getRequestingUsersList(room) {
      const promises = [];
      const accessRequests = room.accessRequests;
      for (var i = 0; i < accessRequests.length; i++) {
        const User = new mongoose.model("User", userSchema);
        promises.push(User.findById(accessRequests[i]));
      }
      const requesting_users = await Promise.all(promises);
      return requesting_users;
    }

    static async requestAccessToRoom(roomId, requesterId) {
      Room.findOneAndUpdate({
        _id: roomId
      }, {
        $push: {
          accessRequests: requesterId
        }
      }, function(err, foundRoom) {
        if (err) {
          console.log(err);
          return;
        } else {
          return foundRoom;
        }
      })
    }

    static async acceptRoomRequestAccess(roomId, requesterId) {
      Room.findOneAndUpdate({
        _id: roomId
      }, {
        $pull: {
          accessRequests: requesterId
        },
        $push: {
          listOfStudents: requesterId
        }
      }, function(err, foundRoom) {
        if (err) {
          console.log(err);
          return;
        } else {
          return foundRoom;
        }
      });
    }

    static async denyRoomRequestAccess(roomId, requesterId) {
      Room.findOneAndUpdate({
        _id: roomId
      }, {
        $pull: {
          accessRequests: requesterId
        }
      }, function(err, foundRoom) {
        if (err) {
          console.log(err);
          return;
        } else {
          return foundRoom;
        }
      });
    }
  }

module.exports = MongoDBRoomManager;
