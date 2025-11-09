import http from "http";
import mongoose from "mongoose";

import app from "./app.js";
import connectDB from "./config/db.js";

// Import các dịch vụ
import websocketService from "./services/websocket.service.js";
import redisService from "./services/redis.service.js";

// Kết nối đến cơ sở dữ liệu
connectDB();

const server = http.createServer(app);

// Khởi tạo WebSocket nếu được bật
if (process.env.WEBSOCKET_ENABLED !== "false") {
  websocketService.initialize(server);
}

// START SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});

// GRACEFUL SHUTDOWN
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");

    // Đóng kết nối cơ sở dữ liệu
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
    });

    // Đóng kết nối Redis
    redisService.disconnect().then(() => {
      console.log("Redis connection closed");
      process.exit(0);
    });
  });
});
