//jshint esversion:6
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

const contentSchema = new mongoose.Schema({
  creatorId: ObjectId,
  creatorUsername: String,
  title: String,
  content:String,
  hasImage: Boolean,
  timestamp: Number, // May cause errors in the future when timestamp exceeds number limits.
  roomId: ObjectId
});

const roomSchema = new mongoose.Schema({
  creatorId: ObjectId,
  name: String,
  description: String,
  listOfStudents: [ObjectId],
  type: String,
  accessRequests: [ObjectId],
  imageUrl: String
});

module.exports.contentSchema= contentSchema;
module.exports.roomSchema = roomSchema;
