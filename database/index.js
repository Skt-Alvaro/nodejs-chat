const { connect } = require("mongoose");

async function connectDB() {
  try {
    await connect(process.env.MONGODB_URL);
    console.log("Conectado correctamente");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB;
