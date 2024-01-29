const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
  friend: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Export model
module.exports = mongoose.model("Friend", FriendSchema);
