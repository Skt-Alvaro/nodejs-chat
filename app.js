const express = require("express");
const http = require("http");

const app = express();

app.use(express.static(process.cwd() + "/client"));

app.get("/", (req, res) => {
  return res.sendFile(process.cwd() + "/client/index.html");
});

const server = http.createServer(app);

module.exports = server;
