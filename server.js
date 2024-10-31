const { WebSocketServer, OPEN } = require("ws");
const {
  handleCreateUser,
  handleFindUserByUsername,
} = require("./users/controllers/users.controller.js");

const server = new WebSocketServer({ port: 8080 });

function startServer() {
  server.on("connection", function connection(ws) {
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
            console.log("creado");
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
          server.broadcastAllButNotMe(
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

    // // Send message to all users
    // server.clients.forEach((client) => {
    //   if (client.readyState === OPEN) {
    //     client.send(
    //       JSON.stringify({
    //         type: "info",
    //         message: `Un nuevo usuario se ha conectado`,
    //       })
    //     );
    //   }
    // });

    ws.onclose = function close() {
      console.log("User disconnected");
    };
  });
}

server.broadcast = (msg) => {
  server.clients.forEach(function each(client) {
    client.send(msg);
  });
};

server.broadcastAllButNotMe = (msg, ws) => {
  server.clients.forEach(function each(client) {
    if (client.username !== ws.username) {
      client.send(msg);
    }
  });
};

module.exports = { startServer, server };
