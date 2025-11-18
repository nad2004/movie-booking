import Theater from "../models/theater.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const theaterController = {
  // Lấy danh sách rạp
  getAllTheaters: async (req, res) => {
    try {
      const { city, page = 1, limit = 10 } = req.query;

      const query = {};
      if (city) {
        query.city = city;
      }

      const skip = (page - 1) * limit;
      const [theaters, total] = await Promise.all([
        Theater.find(query)
          .select("-rooms.seatMap") // Không lấy seatMap để giảm data
          .sort({ city: 1, name: 1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Theater.countDocuments(query),
      ]);

      return successResponse(res, {
        theaters,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    } catch (error) {
      console.error("Get all theaters error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy chi tiết rạp
  getTheaterById: async (req, res) => {
    try {
      const { id } = req.params;

      const theater = await Theater.findById(id).lean();

      if (!theater) {
        return errorResponse(res, "Không tìm thấy rạp", 404);
      }

      return successResponse(res, theater);
    } catch (error) {
      console.error("Get theater by id error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy danh sách rạp theo thành phố
  getTheatersByCity: async (req, res) => {
    try {
      const { city } = req.params;

      const theaters = await Theater.find({
        city: { $regex: city, $options: "i" },
      })
        .select("-rooms.seatMap")
        .sort({ name: 1 })
        .lean();

      return successResponse(res, theaters);
    } catch (error) {
      console.error("Get theaters by city error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy danh sách thành phố có rạp
  getCities: async (req, res) => {
    try {
      const cities = await Theater.distinct("city");

      return successResponse(res, cities.sort());
    } catch (error) {
      console.error("Get cities error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Tạo rạp mới (Admin)
  createTheater: async (req, res) => {
    try {
      console.log("=== CREATE THEATER START ===");
      console.log("Theater data:", req.body);

      const theaterData = req.body;
      theaterData.createdBy = req.userId;

      // Fix Swagger array issue for coordinates
      if (theaterData.location && theaterData.location.coordinates) {
        if (typeof theaterData.location.coordinates === "object" && !Array.isArray(theaterData.location.coordinates)) {
          theaterData.location.coordinates = Object.values(theaterData.location.coordinates);
        }
      }

      // Ensure rooms is an array (can be empty initially)
      if (!theaterData.rooms) {
        theaterData.rooms = [];
      }

      console.log("Fixed theater data:", theaterData);
      console.log("Creating theater...");
      const newTheater = new Theater(theaterData);
      await newTheater.save();

      console.log("Theater created successfully:", newTheater._id);
      return successResponse(res, newTheater, "Tạo rạp thành công", 201);
    } catch (error) {
      console.error("Create theater error:", error);
      console.error("Error message:", error.message);
      return errorResponse(res, error.message || "Lỗi server", 500);
    }
  },

  // Cập nhật thông tin rạp (Admin)
  updateTheater: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      updateData.updatedBy = req.userId;

      const updatedTheater = await Theater.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedTheater) {
        return errorResponse(res, "Không tìm thấy rạp", 404);
      }

      return successResponse(res, updatedTheater, "Cập nhật rạp thành công");
    } catch (error) {
      console.error("Update theater error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Xóa rạp (Admin)
  deleteTheater: async (req, res) => {
    try {
      const { id } = req.params;

      const theater = await Theater.findById(id);
      if (!theater) {
        return errorResponse(res, "Không tìm thấy rạp", 404);
      }

      // ✅ FIX: Kiểm tra xem rạp có lịch chiếu trong tương lai không
      const Schedule = (await import("../models/schedule.model.js")).default;
      const now = new Date();
      const futureSchedules = await Schedule.countDocuments({
        theater: id,
        showDate: { $gte: now },
        status: { $ne: "Đã hủy" },
      });

      if (futureSchedules > 0) {
        return errorResponse(
          res,
          `Không thể xóa rạp. Rạp còn ${futureSchedules} suất chiếu trong tương lai. Vui lòng hủy tất cả lịch chiếu trước khi xóa rạp.`,
          400
        );
      }

      // ✅ FIX: Kiểm tra rạp có phòng chiếu nào không (optional check)
      if (theater.rooms && theater.rooms.length > 0) {
        return errorResponse(
          res,
          `Không thể xóa rạp. Rạp còn ${theater.rooms.length} phòng chiếu. Vui lòng xóa tất cả phòng chiếu trước khi xóa rạp.`,
          400
        );
      }

      // ✅ FIX: Soft delete thay vì hard delete
      theater.isActive = false;
      theater.updatedBy = req.userId;
      await theater.save();

      // Xóa cache
      const redisService = (await import("../services/redis.service.js")).default;
      redisService.invalidateTheaterCache(id.toString()).catch(() => {});

      return successResponse(res, {}, "Xóa rạp thành công");
    } catch (error) {
      console.error("Delete theater error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Thêm phòng chiếu vào rạp (Admin)
  addRoom: async (req, res) => {
    try {
      const { theaterId } = req.params;
      const roomData = req.body;

      const theater = await Theater.findById(theaterId);
      if (!theater) {
        return errorResponse(res, "Không tìm thấy rạp", 404);
      }

      // Validate seat map
      if (!roomData.seatMap || roomData.seatMap.length === 0) {
        return errorResponse(res, "Sơ đồ ghế không hợp lệ", 400);
      }

      theater.rooms.push(roomData);
      theater.updatedBy = req.userId;
      await theater.save();

      return successResponse(res, theater.rooms[theater.rooms.length - 1], "Thêm phòng chiếu thành công", 201);
    } catch (error) {
      console.error("Add room error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Cập nhật phòng chiếu (Admin)
  updateRoom: async (req, res) => {
    try {
      const { theaterId, roomId } = req.params;
      const updateData = req.body;

      const theater = await Theater.findById(theaterId);
      if (!theater) {
        return errorResponse(res, "Không tìm thấy rạp", 404);
      }

      const room = theater.rooms.id(roomId);
      if (!room) {
        return errorResponse(res, "Không tìm thấy phòng chiếu", 404);
      }

      // Update room fields
      Object.assign(room, updateData);
      theater.updatedBy = req.userId;
      await theater.save();

      return successResponse(res, room, "Cập nhật phòng chiếu thành công");
    } catch (error) {
      console.error("Update room error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Xóa phòng chiếu (Admin)
  deleteRoom: async (req, res) => {
    try {
      const { theaterId, roomId } = req.params;

      const theater = await Theater.findById(theaterId);
      if (!theater) {
        return errorResponse(res, "Không tìm thấy rạp", 404);
      }

      // TODO: Kiểm tra phòng có lịch chiếu trong tương lai không

      theater.rooms.pull(roomId);
      theater.updatedBy = req.userId;
      await theater.save();

      return successResponse(res, {}, "Xóa phòng chiếu thành công");
    } catch (error) {
      console.error("Delete room error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default theaterController;
