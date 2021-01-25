const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const PostSchema = new Schema(
  {
    headLine: String,
    subHead: String,
    content: String,
    category: { name: String, img: String },
    user: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
    cover: String,
    review: [{ text: String, user: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema); // bounded to Users collections
