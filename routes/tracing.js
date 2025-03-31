// routes/tracing.js
const express = require('express');
const router = express.Router();

// 트레이싱 라우트 핸들러
router.get('/connection/:socketId', (req, res) => {
  const { socketId } = req.params;
  
  try {
    // connectionTracing 모듈 동적 로드
    const { getConnectionTraceData } = require('../Monitoring/connectionTracing');
    const traceData = getConnectionTraceData(socketId);
    
    res.json({
      success: true,
      socketId,
      traceData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;