const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./newUserModel");
const FriendsListSchema = new Schema({
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("FriendsList", FriendsListSchema);
