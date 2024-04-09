const mongoose = require("mongoose");
const { Schema } = require("mongoose");
let reviewSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: String,
  created_at: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
  },
});
module.exports = mongoose.model("Reviews", reviewSchema);
