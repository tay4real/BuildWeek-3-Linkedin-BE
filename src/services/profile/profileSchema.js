const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const profileSchema = new Schema(
    {
        "name": String,
        "surname": String,
        "email": String,
        "bio": String,
        "title": String,
        "area": String,
        "username": {type: String,
          unique: true},
        "image": String
    },
  { timestamps: true }
)

module.exports = mongoose.model("profile", profileSchema)