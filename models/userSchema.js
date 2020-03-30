const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String,
    min: 2,
    max: 255
  },
  password: {
    required: true,
    type: String,
    min: 2,
    max: 255
  },
  secondName: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("users", userSchema);
