const express = require("express");

const app = express();

app.use(express.static(process.cwd() + "/client"));

app.get("/", (req, res) => {
  return res.sendFile(process.cwd() + "/client/index.html");
});

module.exports = app;
