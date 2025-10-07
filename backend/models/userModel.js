const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add a name"],
    },
    email: {
      type: String,
      required: [true, "please add an email"],
    },
    password: {
      type: String,
      required: [true, "please add a password"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
