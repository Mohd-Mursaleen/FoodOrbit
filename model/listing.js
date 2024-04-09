const mongoose = require("mongoose");
const { Schema } = require("mongoose");
filterEnum = ["meal", "drinks", "desert"];
let listingSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  image: String,
  price: {
    type: Number,
    required: true,
  },
  reviews: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Reviews",
    },
  ],
  type: {
    type: String,
    enum: ["meal", "drinks", "desert"], // Assuming these are the valid types
  },
});
const Listings = mongoose.model("Listings", listingSchema);
module.exports = Listings;
