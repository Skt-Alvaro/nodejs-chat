const User = require("../models/user.model");

async function createUser(username) {
  const user = new User({ username });
  await user.save();
  return user;
}

async function findUserByUsername(username) {
  const user = await User.findOne({ username });

  return user;
}

module.exports = { createUser, findUserByUsername };
