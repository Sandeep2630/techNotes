const User = require("../models/User");
const Note = require("../models/Note");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No uses found" });
  }
  res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "all fields are requried" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    res.status(409).json({ message: "duplicate username" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { username, password: hashedPwd, roles };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `new user created ${username}` });
  } else {
    res.status(400).json({ message: "invalid credential" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, password, active } = req.body;

  if (
    !username ||
    !id ||
    Array.isArray(roles) ||
    !roles.length ||
    typeof active != "boolean"
  ) {
    return res.status(400).json({ message: "invalid data sent" });
  }

  const user = User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "no user found" });
  }

  const duplicate = User.findOne({ username }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(409).json({ message: "duplicate username found" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = bcrypt.hash(password, 10);
  }

  const updateUser = await user.save();

  res.json({ message: `user ${updateUser.username}  updated` });
});
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "userId is requried" });
  }

  const notes = await Note.findOne({ user: id }).lean().exec();

  if (notes?.length) {
    res.status(400).json({ message: "user has notes assigned " });
  }

  const user = User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  const result = await user.deleteOne();

  const reply = `username ${result.username} with id ${result._id} is deleted`;

  res.json(reply);
});

module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
};
