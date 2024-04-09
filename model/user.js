const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  orders: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Listings",
    },
  ],
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Users", userSchema);
