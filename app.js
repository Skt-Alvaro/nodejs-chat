const express = require("express");

const app = express();

app.use(express.static(process.cwd() + "/client"));

app.get("/", (req, res) => {
  return res.sendFile(process.cwd() + "/client/index.html");
});

app.get("/env", (req, res) => {
  res.json({ websocketUrl: process.env.WEBSOCKET_URL });
});

module.exports = app;
