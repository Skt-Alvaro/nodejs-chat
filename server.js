const { WebSocketServer, OPEN } = require("ws");
const server = require("./app.js");
const {
  handleCreateUser,
  handleFindUserByUsername,
} = require("./users/controllers/users.controller.js");

const wss = new WebSocketServer({ server });

function startServer() {
  wss.on("connection", function connection(ws) {
    console.log("User connected");

    ws.on("message", async (data) => {
      const { type, username, message } = JSON.parse(data);

      switch (type) {
        case "init": {
          const user = await handleFindUserByUsername(username);
          let newUsername = "";

          if (!user) {
            newUsername = `user_${Math.floor(Math.random() * 1000)}`;
            await handleCreateUser(newUsername);
          }

          ws.username = user ? username : newUsername;

          ws.send(
            JSON.stringify({
              type: "welcome",
              message: `Bienvenido ${user ? username : newUsername}`,
              username: user ? username : newUsername,
            })
          );

          break;
        }

        case "message": {
          wss.broadcastAllButNotMe(
            JSON.stringify({
              type: "incoming_message",
              message,
              username: ws.username,
            }),
            ws
          );
        }

        default:
          break;
      }
    });

    // ws.send(JSON.stringify({ type: "init", username }));

    // Send message to all users
    wss.clients.forEach((client) => {
      if (client.readyState === OPEN) {
        client.send(
          JSON.stringify({
            type: "info",
            message: `Un nuevo usuario se ha conectado`,
          })
        );
      }
    });

    ws.onclose = function close() {
      console.log("User disconnected");
    };
  });
}

wss.broadcast = (msg) => {
  wss.clients.forEach(function each(client) {
    client.send(msg);
  });
};

wss.broadcastAllButNotMe = (msg, ws) => {
  wss.clients.forEach(function each(client) {
    if (client.username !== ws.username) {
      client.send(msg);
    }
  });
};

module.exports = { startServer, wss };
