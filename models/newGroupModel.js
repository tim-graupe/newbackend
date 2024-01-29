const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const GroupSchema = new mongoose.Schema({
  name: { type: String, maxLength: 100 },
  description: { type: String, maxLength: 500 },
  pic: { type: String },
  admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  private: { type: Boolean, required: true },
});

module.exports = mongoose.model("Group", GroupSchema);
