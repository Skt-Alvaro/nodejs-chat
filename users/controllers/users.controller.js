const { createUser, findUserByUsername } = require("../services/users.service");

async function handleCreateUser(username) {
  await createUser(username);

  return { status: "ok" };
}

async function handleFindUserByUsername(username) {
  const user = await findUserByUsername(username);

  return user;
}

module.exports = { handleCreateUser, handleFindUserByUsername };
