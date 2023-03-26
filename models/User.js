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
    default: ture,
  },
});

module.exports = mongoose.modal("User", userSchema);
