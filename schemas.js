//jshint esversion:6
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectID;

const ratingSchema = new mongoose.Schema({
  rate: Number,
  description: String
});

const itemSchema = new mongoose.Schema({
  merchantStoreId: ObjectId,
  name: String,
  price: Number,
  image: String,
  description: String
});

const storeSchema = new mongoose.Schema({
  creatorId: ObjectId,
  items: [itemSchema]
});

const userSchema = new mongoose.Schema({
  username: String,
  googleId: String,
  outlookId: String,
  facebookId: String,
  name: String,
  country: String,
  rating: ratingSchema,
  store: storeSchema,
  phoneNumber: String,
  imageUrl: String
});

const contentSchema = new mongoose.Schema({
  creatorId: ObjectId,
  type:String,
  title:String,
  content:String,
  image:{ data: Buffer, contentType: String },
  invitation_url: String
});

module.exports.ratingSchema = ratingSchema;
module.exports.itemSchema = itemSchema;
module.exports.storeSchema = storeSchema;
module.exports.userSchema = userSchema;
module.exports.contentSchema= contentSchema;
