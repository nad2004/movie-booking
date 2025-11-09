import Booking from "../models/booking.model.js";
import Movie from "../models/movie.model.js";
import User from "../models/user.model.js";
import Schedule from "../models/schedule.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const statisticsController = {
  // Tổng quan hệ thống
  getOverview: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // Default: tháng hiện tại
      const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const end = endDate ? new Date(endDate) : new Date();

      const [totalRevenue, totalBookings, totalCustomers, totalMovies, completedBookings, cancelledBookings] =
        await Promise.all([
          // Tổng doanh thu
          Booking.aggregate([
            {
              $match: {
                createdAt: { $gte: start, $lte: end },
                status: "Hoàn tất",
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$totalAmount" },
              },
            },
          ]),

          // Tổng số booking
          Booking.countDocuments({
            createdAt: { $gte: start, $lte: end },
          }),

          // Tổng số khách hàng
          User.countDocuments({ role: "customer" }),

          // Tổng số phim
          Movie.countDocuments(),

          // Số booking hoàn tất
          Booking.countDocuments({
            createdAt: { $gte: start, $lte: end },
            status: "Hoàn tất",
          }),

          // Số booking bị hủy
          Booking.countDocuments({
            createdAt: { $gte: start, $lte: end },
            status: "Đã hủy",
          }),
        ]);

      // Tính % thay đổi so với kỳ trước
      const previousStart = new Date(start);
      previousStart.setMonth(previousStart.getMonth() - 1);
      const previousEnd = new Date(end);
      previousEnd.setMonth(previousEnd.getMonth() - 1);

      const previousRevenue = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: previousStart, $lte: previousEnd },
            status: "Hoàn tất",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]);

      const currentRevenue = totalRevenue[0]?.total || 0;
      const prevRevenue = previousRevenue[0]?.total || 0;
      const revenueChange = prevRevenue > 0 ? (((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(2) : 0;

      return successResponse(res, {
        overview: {
          totalRevenue: currentRevenue,
          revenueChange: parseFloat(revenueChange),
          totalBookings,
          completedBookings,
          cancelledBookings,
          successRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(2) : 0,
          totalCustomers,
          totalMovies,
        },
        period: {
          start,
          end,
        },
      });
    } catch (error) {
      console.error("Get overview error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Doanh thu theo thời gian
  getRevenue: async (req, res) => {
    try {
      const { startDate, endDate, groupBy = "day" } = req.query;

      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate ? new Date(endDate) : new Date();

      // Group by format
      let dateFormat;
      switch (groupBy) {
        case "hour":
          dateFormat = { $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" } };
          break;
        case "day":
          dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
          break;
        case "week":
          dateFormat = { $dateToString: { format: "%Y-W%V", date: "$createdAt" } };
          break;
        case "month":
          dateFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
          break;
        case "year":
          dateFormat = { $dateToString: { format: "%Y", date: "$createdAt" } };
          break;
        default:
          dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
      }

      const revenueData = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: "Hoàn tất",
          },
        },
        {
          $group: {
            _id: dateFormat,
            totalRevenue: { $sum: "$totalAmount" },
            ticketsRevenue: { $sum: "$ticketsAmount" },
            productsRevenue: { $sum: "$productsAmount" },
            totalBookings: { $sum: 1 },
            totalTickets: { $sum: { $size: "$seats" } },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Thống kê theo phương thức thanh toán
      const paymentMethods = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: "Hoàn tất",
          },
        },
        {
          $group: {
            _id: "$paymentDetails.paymentMethod",
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]);

      return successResponse(res, {
        revenueByTime: revenueData,
        paymentMethods,
        summary: {
          totalRevenue: revenueData.reduce((sum, item) => sum + item.totalRevenue, 0),
          totalBookings: revenueData.reduce((sum, item) => sum + item.totalBookings, 0),
          totalTickets: revenueData.reduce((sum, item) => sum + item.totalTickets, 0),
          avgRevenuePerBooking:
            revenueData.length > 0
              ? (
                  revenueData.reduce((sum, item) => sum + item.totalRevenue, 0) /
                  revenueData.reduce((sum, item) => sum + item.totalBookings, 0)
                ).toFixed(2)
              : 0,
        },
      });
    } catch (error) {
      console.error("Get revenue error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Thống kê phim
  getMovieStats: async (req, res) => {
    try {
      const { startDate, endDate, limit = 10 } = req.query;

      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate ? new Date(endDate) : new Date();

      // Top phim theo doanh thu
      const topMoviesByRevenue = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: "Hoàn tất",
          },
        },
        {
          $group: {
            _id: "$movieTitle",
            totalRevenue: { $sum: "$totalAmount" },
            totalBookings: { $sum: 1 },
            totalTickets: { $sum: { $size: "$seats" } },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
        {
          $limit: parseInt(limit),
        },
      ]);

      // Top phim theo số vé bán
      const topMoviesByTickets = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: "Hoàn tất",
          },
        },
        {
          $group: {
            _id: "$movieTitle",
            totalTickets: { $sum: { $size: "$seats" } },
            totalRevenue: { $sum: "$totalAmount" },
            totalBookings: { $sum: 1 },
          },
        },
        {
          $sort: { totalTickets: -1 },
        },
        {
          $limit: parseInt(limit),
        },
      ]);

      // Thống kê theo thể loại
      const genreStats = await Movie.aggregate([
        {
          $lookup: {
            from: "schedules",
            localField: "_id",
            foreignField: "movie",
            as: "schedules",
          },
        },
        {
          $unwind: "$schedules",
        },
        {
          $lookup: {
            from: "bookings",
            localField: "schedules._id",
            foreignField: "schedule",
            as: "bookings",
          },
        },
        {
          $unwind: {
            path: "$bookings",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "bookings.createdAt": { $gte: start, $lte: end },
            "bookings.status": "Hoàn tất",
          },
        },
        {
          $unwind: "$genres",
        },
        {
          $lookup: {
            from: "genres",
            localField: "genres",
            foreignField: "_id",
            as: "genreInfo",
          },
        },
        {
          $unwind: "$genreInfo",
        },
        {
          $group: {
            _id: "$genreInfo.name",
            totalRevenue: { $sum: "$bookings.totalAmount" },
            totalBookings: { $sum: 1 },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
      ]);

      // Tỷ lệ lấp đầy phòng chiếu
      const occupancyRate = await Schedule.aggregate([
        {
          $match: {
            showDate: { $gte: start, $lte: end },
            status: { $in: ["Đang mở bán vé", "Sắp đầy", "Hết vé", "Đã chiếu"] },
          },
        },
        {
          $group: {
            _id: null,
            avgOccupancy: {
              $avg: {
                $multiply: [{ $divide: ["$bookedSeatsCount", "$totalSeats"] }, 100],
              },
            },
            totalSeats: { $sum: "$totalSeats" },
            bookedSeats: { $sum: "$bookedSeatsCount" },
          },
        },
      ]);

      return successResponse(res, {
        topMoviesByRevenue,
        topMoviesByTickets,
        genreStats,
        occupancyRate: occupancyRate[0] || {
          avgOccupancy: 0,
          totalSeats: 0,
          bookedSeats: 0,
        },
      });
    } catch (error) {
      console.error("Get movie stats error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Thống kê khách hàng
  getCustomerStats: async (req, res) => {
    try {
      const { startDate, endDate, limit = 10 } = req.query;

      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate ? new Date(endDate) : new Date();

      // Top khách hàng theo doanh thu
      const topCustomers = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: "Hoàn tất",
          },
        },
        {
          $group: {
            _id: "$customer",
            totalSpent: { $sum: "$totalAmount" },
            totalBookings: { $sum: 1 },
            totalTickets: { $sum: { $size: "$seats" } },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "customerInfo",
          },
        },
        {
          $unwind: "$customerInfo",
        },
        {
          $project: {
            _id: 1,
            fullName: "$customerInfo.fullName",
            email: "$customerInfo.email",
            membershipLevel: "$customerInfo.membershipLevel",
            totalSpent: 1,
            totalBookings: 1,
            totalTickets: 1,
          },
        },
        {
          $sort: { totalSpent: -1 },
        },
        {
          $limit: parseInt(limit),
        },
      ]);

      // Khách hàng mới
      const newCustomers = await User.countDocuments({
        role: "customer",
        createdAt: { $gte: start, $lte: end },
      });

      // Phân bố theo membership level
      const membershipDistribution = await User.aggregate([
        {
          $match: { role: "customer" },
        },
        {
          $group: {
            _id: "$membershipLevel",
            count: { $sum: 1 },
          },
        },
      ]);

      return successResponse(res, {
        topCustomers,
        newCustomers,
        membershipDistribution,
      });
    } catch (error) {
      console.error("Get customer stats error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Thống kê theo rạp
  getTheaterStats: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate ? new Date(endDate) : new Date();

      const theaterStats = await Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: "Hoàn tất",
          },
        },
        {
          $group: {
            _id: "$theaterName",
            totalRevenue: { $sum: "$totalAmount" },
            totalBookings: { $sum: 1 },
            totalTickets: { $sum: { $size: "$seats" } },
            avgRevenuePerBooking: { $avg: "$totalAmount" },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
      ]);

      return successResponse(res, theaterStats);
    } catch (error) {
      console.error("Get theater stats error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Export báo cáo
  exportReport: async (req, res) => {
    try {
      const { type, startDate, endDate, format = "json" } = req.query;

      // TODO: Implement export to Excel/PDF
      // Có thể dùng thư viện: exceljs, pdfkit

      return successResponse(res, { type, startDate, endDate, format }, "Export báo cáo sẽ được implement sau");
    } catch (error) {
      console.error("Export report error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default statisticsController;
