const User = require("../models/user.model");

async function createUser(username) {
  const user = new User({ username });
  await user.save();
  return user;
}

async function findUserByUsername(username) {
  console.log("Empieza a buscar");
  const user = await User.findOne({ username });
  console.log(user);

  return user;
}

module.exports = { createUser, findUserByUsername };
