module.exports = function (io) {
  // io 관련된 모든 펑션
  io.on("connection", async (socket) => {
    console.log("client is connected", socket.id);
  });
};
