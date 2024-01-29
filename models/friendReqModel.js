const mongoose = require("mongoose");

const FriendReqSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Export model
module.exports = mongoose.model("FriendReq", FriendReqSchema);
