const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// 필요한 환경 변수 확인
if (!process.env.DB) {
  console.error("DB 환경 변수를 설정해 주세요.");
  process.exit(1);
}

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 데이터베이스 연결
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(process.env.DB);
    console.log("데이터베이스에 연결되었습니다");
  })
  .catch((error) => {
    console.error("데이터베이스 연결 오류:", error);
  });

// 기본 경로 처리
app.get('/', (req, res) => { res.send('hello open'); });

// 트레이싱 라우터 설정
try {
  const tracingRoutes = require('./routes/tracing');
  app.use('/api/tracing', tracingRoutes);
} catch (error) {
  console.warn("트레이싱 라우터를 로드할 수 없습니다:", error.message);
}

module.exports = app;