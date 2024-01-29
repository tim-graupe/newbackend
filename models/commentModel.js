const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 1000,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  pic: {
    type: String,
  },
  date_posted: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

CommentSchema.virtual("url").get(function () {
  return DateTime.fromJSDate(this.date_posted).toLocaleString(
    DateTime.DATETIME_MED
  );
});

CommentSchema.virtual("date_posted_formatted").get(function () {
  return DateTime.fromJSDate(this.date_posted).toISODate();
});

// Export model
module.exports = mongoose.model("Comment", CommentSchema);
