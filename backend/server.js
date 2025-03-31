require("dotenv").config();
const connectDB = require("./src/config/db");
const {createServer} = require("http");

connectDB();

const app = require("./src/app");
const PORT = process.env.PORT || 3000;

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

