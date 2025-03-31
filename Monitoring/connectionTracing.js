// connectionTracing.js
const { context, trace } = require('@opentelemetry/api');

/**
 * 소켓 연결을 위한 트레이서를 생성하고 연결 추적 정보를 내보냅니다
 * @param {Server} io - Socket.io 서버 인스턴스
 */
function setupConnectionTracing(io) {
  const tracer = trace.getTracer('socket-connection-tracer');
  
  // 새 연결 시도 추적
  io.on('connection', (socket) => {
    // 이 연결에 대한 새 스팬 생성
    const span = tracer.startSpan('socket_connection');
    
    // 스팬에 연결 메타데이터 추가
    span.setAttribute('socket.id', socket.id);
    span.setAttribute('socket.handshake.address', socket.handshake.address);
    span.setAttribute('socket.transport', socket.conn.transport.name);
    
    console.log(`[추적] 새 연결: ${socket.id} (IP: ${socket.handshake.address})`);
    
    // 이 스팬으로 컨텍스트 생성
    const ctx = trace.setSpan(context.active(), span);
    
    // 연결 해제 추적
    socket.on('disconnect', (reason) => {
      span.setAttribute('socket.disconnect.reason', reason);
      span.end(); // 연결이 닫힐 때 스팬 종료
      console.log(`[추적] 연결 종료: ${socket.id}, 이유: ${reason}`);
    });
    
    // 연결 오류 추적
    socket.on('error', (error) => {
      span.recordException(error);
      span.setStatus({ code: trace.SpanStatusCode.ERROR });
      console.error(`[추적] 연결 오류: ${socket.id}`, error);
    });
    
    // 이 소켓의 모든 이벤트 추적
    socket.onAny((event, ...args) => {
      try {
        const eventSpan = tracer.startSpan(`socket_event.${event}`);
        eventSpan.setAttribute('socket.event', event);
        eventSpan.setAttribute('socket.id', socket.id);
        
        console.log(`[추적] 소켓 이벤트: ${event} (${socket.id})`);
        
        // 이벤트 처리 후 스팬 종료
        setTimeout(() => {
          eventSpan.end();
        }, 0);
      } catch (error) {
        console.error(`[추적] 이벤트 추적 중 오류: ${event}`, error);
      }
    });
  });
}

/**
 * 특정 연결에 대한 추적 데이터를 추출하여 반환합니다
 * @param {string} socketId - 추적 데이터를 가져올 소켓 ID
 * @returns {Object} 연결에 대한 추적 데이터
 */
function getConnectionTraceData(socketId) {
  try {
    // 이 부분은 실제로 OpenTelemetry 구현에 따라 다를 수 있습니다
    // 대부분의 경우 별도의 데이터 저장소에서 추적 데이터를 가져와야 합니다
    return {
      socketId,
      timestamp: new Date().toISOString(),
      message: "추적 데이터 추출 요청됨"
    };
  } catch (error) {
    console.error("추적 데이터 추출 오류:", error);
    return {
      error: "추적 데이터를 가져올 수 없습니다.",
      message: error.message
    };
  }
}

module.exports = {
  setupConnectionTracing,
  getConnectionTraceData
};