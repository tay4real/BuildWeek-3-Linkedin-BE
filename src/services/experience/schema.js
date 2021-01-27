const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const experienceSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    startDate: Date,
    endDate: Date,
    company: String,
    description: String,
    area: String,
    image: String,

    image: String, //server generated on upload, set a default here
    profiles: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  },
  {
    timestamps: true,
  }
);
experienceSchema.static("findExpWithProfile", async function (id) {
  const exp = await experienceSchema.findById(id).populate("profiles");
  return post;
});
const experienceModel = mongoose.model("experience", experienceSchema);
module.exports = experienceModel;
