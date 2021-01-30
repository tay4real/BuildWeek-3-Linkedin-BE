const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const PostSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    postimageUrl: String,
    username: { type: String, required: true },
    profiles: [{ type: Schema.Types.ObjectId, ref: "profile" }],
    comments: [
      {
        text: String,
        profiles: [{ type: Schema.Types.ObjectId, ref: "profile" }],
      },
    ],
    likes: [
      {
        profiles: [{ type: Schema.Types.ObjectId, ref: "profile" }],
      },
    ],
  },
  {
    timestamps: true,
  }
);

PostSchema.static("findPostWithProfile", async function (id) {
  const post = await PostModel.findById(id).populate("profiles");
  return post;
});
const PostModel = mongoose.model("Post", PostSchema);
module.exports = PostModel;
