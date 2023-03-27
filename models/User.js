const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    requried: true,
  },
  password: {
    type: String,
    requried: true,
  },
  roles: [
    {
      type: String,
      default: "Employee",
    },
  ],
  active: {
    type: String,
    default: true,
  },
});

module.exports = mongoose.model("User", userSchema);
