const { connect } = require("mongoose");

async function connectDB() {
  try {
    await connect("mongodb://user:user@localhost:27017/chat?authSource=admin");
    console.log("Conectado correctamente");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB;
