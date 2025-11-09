import Schedule from "../models/schedule.model.js";
import Movie from "../models/movie.model.js";
import Theater from "../models/theater.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const scheduleController = {
  // Lấy danh sách lịch chiếu (có filter)
  getAllSchedules: async (req, res) => {
    try {
      const { movieId, theaterId, date, startDate, endDate, status, page = 1, limit = 20 } = req.query;

      const query = {};

      if (movieId) query.movie = movieId;
      if (theaterId) query.theater = theaterId;
      if (status) query.status = status;

      if (date) {
        const searchDate = new Date(date);
        query.showDate = {
          $gte: new Date(searchDate.setHours(0, 0, 0)),
          $lt: new Date(searchDate.setHours(23, 59, 59)),
        };
      } else if (startDate && endDate) {
        query.showDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const skip = (page - 1) * limit;
      const [schedules, total] = await Promise.all([
        Schedule.find(query)
          .populate("movie", "title posterUrl duration rating")
          .populate("theater", "name address city")
          .sort({ showDate: 1, startTime: 1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Schedule.countDocuments(query),
      ]);

      return successResponse(res, {
        schedules,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    } catch (error) {
      console.error("Get all schedules error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy lịch chiếu theo phim
  getSchedulesByMovie: async (req, res) => {
    try {
      const { movieId } = req.params;
      const { date } = req.query;

      const movie = await Movie.findById(movieId);
      if (!movie) {
        return errorResponse(res, "Không tìm thấy phim", 404);
      }

      const query = {
        movie: movieId,
        status: { $in: ["Đang mở bán vé", "Sắp đầy"] },
      };

      if (date) {
        const searchDate = new Date(date);
        query.showDate = {
          $gte: new Date(searchDate.setHours(0, 0, 0)),
          $lt: new Date(searchDate.setHours(23, 59, 59)),
        };
      }

      const schedules = await Schedule.find(query)
        .populate("theater", "name address city")
        .sort({ showDate: 1, startTime: 1 })
        .lean();

      // Group by theater
      const groupedByTheater = schedules.reduce((acc, schedule) => {
        const theaterId = schedule.theater._id.toString();
        if (!acc[theaterId]) {
          acc[theaterId] = {
            theater: schedule.theater,
            schedules: [],
          };
        }
        acc[theaterId].schedules.push(schedule);
        return acc;
      }, {});

      return successResponse(res, {
        movie: {
          id: movie._id,
          title: movie.title,
          posterUrl: movie.posterUrl,
          duration: movie.duration,
        },
        theaters: Object.values(groupedByTheater),
      });
    } catch (error) {
      console.error("Get schedules by movie error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy lịch chiếu theo rạp
  getSchedulesByTheater: async (req, res) => {
    try {
      const { theaterId } = req.params;
      const { date } = req.query;

      const theater = await Theater.findById(theaterId);
      if (!theater) {
        return errorResponse(res, "Không tìm thấy rạp", 404);
      }

      const query = {
        theater: theaterId,
        status: { $in: ["Đang mở bán vé", "Sắp đầy"] },
      };

      if (date) {
        const searchDate = new Date(date);
        query.showDate = {
          $gte: new Date(searchDate.setHours(0, 0, 0)),
          $lt: new Date(searchDate.setHours(23, 59, 59)),
        };
      }

      const schedules = await Schedule.find(query)
        .populate("movie", "title posterUrl duration rating")
        .sort({ startTime: 1 })
        .lean();

      // Group by movie
      const groupedByMovie = schedules.reduce((acc, schedule) => {
        const movieId = schedule.movie._id.toString();
        if (!acc[movieId]) {
          acc[movieId] = {
            movie: schedule.movie,
            schedules: [],
          };
        }
        acc[movieId].schedules.push(schedule);
        return acc;
      }, {});

      return successResponse(res, {
        theater: {
          id: theater._id,
          name: theater.name,
          address: theater.address,
          city: theater.city,
        },
        movies: Object.values(groupedByMovie),
      });
    } catch (error) {
      console.error("Get schedules by theater error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy chi tiết lịch chiếu (bao gồm seat availability)
  getScheduleById: async (req, res) => {
    try {
      const { id } = req.params;

      const schedule = await Schedule.findById(id)
        .populate("movie", "title posterUrl duration rating")
        .populate("theater", "name address city")
        .lean();

      if (!schedule) {
        return errorResponse(res, "Không tìm thấy lịch chiếu", 404);
      }

      // Release expired holds trước khi trả về
      await Schedule.findById(id).then((s) => s.releaseExpiredHolds());

      // Refresh data sau khi release
      const updatedSchedule = await Schedule.findById(id)
        .populate("movie", "title posterUrl duration rating")
        .populate("theater", "name address city")
        .lean();

      return successResponse(res, updatedSchedule);
    } catch (error) {
      console.error("Get schedule by id error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Tạo lịch chiếu mới (Admin)
  createSchedule: async (req, res) => {
    try {
      const {
        movieId,
        theaterId,
        roomId,
        roomName,
        roomType,
        showDate,
        startTime,
        endTime,
        ticketPrices,
        language,
        subtitles,
      } = req.body;

      // Validate movie
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return errorResponse(res, "Không tìm thấy phim", 404);
      }

      // Validate theater
      const theater = await Theater.findById(theaterId);
      if (!theater) {
        return errorResponse(res, "Không tìm thấy rạp", 404);
      }

      // Validate room
      const room = theater.rooms.id(roomId);
      if (!room) {
        return errorResponse(res, "Không tìm thấy phòng chiếu", 404);
      }

      // Check conflict
      const hasConflict = await Schedule.checkRoomConflict(theaterId, roomId, new Date(showDate), startTime, endTime);

      if (hasConflict) {
        return errorResponse(res, "Phòng chiếu đã có lịch chiếu trùng giờ", 400);
      }

      // Initialize seat availability từ room
      const seatAvailability = room.seatMap.map((seat) => ({
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        isBooked: false,
      }));

      const newSchedule = new Schedule({
        movie: movieId,
        theater: theaterId,
        room: roomId,
        roomName: roomName || room.roomName,
        roomType: roomType || room.roomType,
        showDate: new Date(showDate),
        startTime,
        endTime,
        ticketPrices,
        seatAvailability,
        totalSeats: room.seatMap.length,
        language: language || movie.language,
        subtitles: subtitles || movie.subtitles,
        createdBy: req.userId,
      });

      await newSchedule.save();

      const populatedSchedule = await Schedule.findById(newSchedule._id)
        .populate("movie", "title posterUrl")
        .populate("theater", "name address");

      return successResponse(res, populatedSchedule, "Tạo lịch chiếu thành công", 201);
    } catch (error) {
      console.error("Create schedule error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Cập nhật lịch chiếu (Admin)
  updateSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      updateData.updatedBy = req.userId;

      const schedule = await Schedule.findById(id);
      if (!schedule) {
        return errorResponse(res, "Không tìm thấy lịch chiếu", 404);
      }

      // Không cho update nếu đã có booking
      if (schedule.bookedSeatsCount > 0) {
        return errorResponse(res, "Không thể cập nhật lịch chiếu đã có người đặt vé", 400);
      }

      // Check conflict nếu update time
      if (updateData.startTime || updateData.endTime) {
        const hasConflict = await Schedule.checkRoomConflict(
          schedule.theater,
          schedule.room,
          schedule.showDate,
          updateData.startTime || schedule.startTime,
          updateData.endTime || schedule.endTime,
          id
        );

        if (hasConflict) {
          return errorResponse(res, "Phòng chiếu đã có lịch chiếu trùng giờ", 400);
        }
      }

      const updatedSchedule = await Schedule.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate("movie theater");

      return successResponse(res, updatedSchedule, "Cập nhật lịch chiếu thành công");
    } catch (error) {
      console.error("Update schedule error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Hủy lịch chiếu (Admin)
  cancelSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const schedule = await Schedule.findById(id);
      if (!schedule) {
        return errorResponse(res, "Không tìm thấy lịch chiếu", 404);
      }

      if (schedule.status === "Đã hủy") {
        return errorResponse(res, "Lịch chiếu đã được hủy trước đó", 400);
      }

      // Nếu có booking, cần hủy tất cả và hoàn tiền
      if (schedule.bookedSeatsCount > 0) {
        // TODO: Cancel all bookings và refund
        return errorResponse(res, "Lịch chiếu đã có người đặt vé. Vui lòng liên hệ support để hủy", 400);
      }

      schedule.status = "Đã hủy";
      schedule.updatedBy = req.userId;
      await schedule.save();

      return successResponse(res, { reason }, "Hủy lịch chiếu thành công");
    } catch (error) {
      console.error("Cancel schedule error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Xóa lịch chiếu (Admin)
  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;

      const schedule = await Schedule.findById(id);
      if (!schedule) {
        return errorResponse(res, "Không tìm thấy lịch chiếu", 404);
      }

      // Chỉ cho xóa nếu chưa có booking
      if (schedule.bookedSeatsCount > 0) {
        return errorResponse(res, "Không thể xóa lịch chiếu đã có người đặt vé", 400);
      }

      await Schedule.findByIdAndDelete(id);

      return successResponse(res, {}, "Xóa lịch chiếu thành công");
    } catch (error) {
      console.error("Delete schedule error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default scheduleController;
