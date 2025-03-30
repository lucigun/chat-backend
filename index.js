const { createSever } = require("http");
const app = require("./app");
const { Server } = require("socket.io");
require("dotenv").config();


const httpSever = createSever(app);

const io = new Server(httpSever, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  },
});

require("./utils/io")(io);

httpSever.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
