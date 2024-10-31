const dotenv = require("dotenv");
const app = require("./app.js");
const { startServer } = require("./server.js");
const connectDB = require("./database/index.js");

dotenv.config();

const PORT = process.env.PORT || 3002;

connectDB();
startServer();
app.listen(PORT, () => console.log("Escuchando en el puerto: " + PORT));
