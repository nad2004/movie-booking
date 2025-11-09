import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import routes from "./routes/index.js";
import redisService from "./services/redis.service.js";
import websocketService from "./services/websocket.service.js";
import { specs, swaggerUi } from "./config/swagger.js";
import { successResponse, errorResponse } from "./utils/response.js";

const app = express();

// ------MIDDLEWARE-------

// Bảo mật
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Ghi log
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Giới hạn tỷ lệ request
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Quá nhiều request từ IP này, vui lòng thử lại sau",
});
app.use("/api/", limiter);

// Giới hạn tỷ lệ chặt chẽ hơn cho các endpoint xác thực
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Quá nhiều lần đăng nhập, vui lòng thử lại sau 15 phút",
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ------SWAGGER DOCUMENTATION------

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// -------ROUTES--------

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
      redis: redisService.isConnected ? "Connected" : "Disconnected",
      websocket: websocketService.io ? "Active" : "Inactive",
    },
  });
});

// Các routes API
app.use("/api", routes);

// ------ERROR HANDLING---------

// Xử lý lỗi 404
app.use((req, res) => {
  return errorResponse(res, "Endpoint không tồn tại", 404);
});

// Trình xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error("Global error:", err);

  // Lỗi validation của Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Lỗi validation",
      errors,
    });
  }

  // Lỗi khóa trùng lặp của Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, `${field} đã tồn tại trong hệ thống`, 400);
  }

  // Lỗi cast của Mongoose
  if (err.name === "CastError") {
    return errorResponse(res, "ID không hợp lệ", 400);
  }

  // Lỗi từ Multer
  if (err.name === "MulterError") {
    return errorResponse(res, err.message, 400);
  }

  // Lỗi mặc định
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Lỗi server",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
