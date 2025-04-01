const { createServer } = require("http");
const app = require("./app");
const { Server } = require("socket.io");
require("dotenv").config();
require("./Monitoring/tracing"); // 기존 모니터링 설정 파일

const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: [
			"http://localhost:3000",
			"http://127.0.0.1:3000",
			"http://127.0.0.1:3001",
		],
	},
});

// 연결 추적 설정
try {
	const { setupConnectionTracing } = require("./Monitoring/connectionTracing");
	setupConnectionTracing(io);
	console.log("소켓 연결 추적이 설정되었습니다.");
} catch (error) {
	console.error("소켓 연결 추적 설정 실패:", error.message);
}

// 기존 소켓 설정
require("./utils/io")(io);

httpServer.listen(process.env.PORT, () => {
	console.log(`서버가 ${process.env.PORT} 포트에서 실행 중입니다.`);
});
