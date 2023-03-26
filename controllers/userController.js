const User = require("../models/User");
const Note = require("../models/Note");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUser = asyncHandler(async (req, res) => {});
const createNewUser = asyncHandler(async (req, res) => {});
const updateUser = asyncHandler(async (req, res) => {});
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
};
