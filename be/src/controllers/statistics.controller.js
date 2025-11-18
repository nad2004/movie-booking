import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import Booking from "../models/booking.model.js";
import Movie from "../models/movie.model.js";
import Schedule from "../models/schedule.model.js";
import User from "../models/user.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

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
      const { type, startDate, endDate, format = "excel" } = req.query;

      const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
      const end = endDate ? new Date(endDate) : new Date();

      // Get data based on type
      let data = [];
      let filename = "";
      let title = "";

      if (type === "revenue" || !type) {
        const bookings = await Booking.find({
          createdAt: { $gte: start, $lte: end },
          status: "Hoàn tất",
        })
          .populate("customer", "fullName email")
          .populate("schedule", "movie showDate")
          .lean();

        data = bookings.map((b) => ({
          "Mã đặt vé": b.bookingCode,
          "Khách hàng": b.customer?.fullName || "N/A",
          Email: b.customer?.email || "N/A",
          Phim: b.movieTitle,
          Rạp: b.theaterName,
          "Ngày chiếu": b.showDate?.toISOString().split("T")[0] || "N/A",
          "Số ghế": b.seats?.length || 0,
          "Tổng tiền": b.totalAmount,
          "Ngày đặt": b.createdAt.toISOString().split("T")[0],
        }));

        title = "Báo cáo doanh thu";
        filename = `revenue_${start.toISOString().split("T")[0]}_${end.toISOString().split("T")[0]}`;
      } else if (type === "bookings") {
        const bookings = await Booking.find({
          createdAt: { $gte: start, $lte: end },
        })
          .populate("customer", "fullName email")
          .lean();

        data = bookings.map((b) => ({
          "Mã đặt vé": b.bookingCode,
          "Khách hàng": b.customer?.fullName || "N/A",
          "Trạng thái": b.status,
          "Tổng tiền": b.totalAmount,
          "Ngày đặt": b.createdAt.toISOString().split("T")[0],
        }));

        title = "Báo cáo đặt vé";
        filename = `bookings_${start.toISOString().split("T")[0]}_${end.toISOString().split("T")[0]}`;
      } else if (type === "customers") {
        //  FIX: Extract customer stats logic directly instead of calling controller method
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
            $limit: 100,
          },
        ]);

        data = topCustomers.map((c) => ({
          Tên: c.fullName || "N/A",
          Email: c.email || "N/A",
          "Hạng thành viên": c.membershipLevel || "Bạc",
          "Tổng chi tiêu": c.totalSpent || 0,
          "Số đơn": c.totalBookings || 0,
          "Số vé": c.totalTickets || 0,
        }));

        title = "Báo cáo khách hàng";
        filename = `customers_${start.toISOString().split("T")[0]}_${end.toISOString().split("T")[0]}`;
      }

      //  FIX: Export to Excel or PDF
      if (format === "excel") {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(title);

        // Add header
        if (data.length > 0) {
          worksheet.columns = Object.keys(data[0]).map((key) => ({
            header: key,
            key: key,
            width: 20,
          }));

          // Add data
          data.forEach((row) => {
            worksheet.addRow(row);
          });

          // Style header
          worksheet.getRow(1).font = { bold: true };
          worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
          };
        }

        // Set headers
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}.xlsx"`);

        await workbook.xlsx.write(res);
        res.end();
      } else if (format === "pdf") {
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}.pdf"`);
        doc.pipe(res);

        // Add title
        doc.fontSize(20).text(title, { align: "center" });
        doc.moveDown();

        // Add date range
        doc.fontSize(12).text(`Từ: ${start.toLocaleDateString("vi-VN")} đến ${end.toLocaleDateString("vi-VN")}`, {
          align: "center",
        });
        doc.moveDown(2);

        // Add table
        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          const colWidth = 500 / headers.length;

          // Headers
          doc.fontSize(10).font("Helvetica-Bold");
          let x = 50;
          headers.forEach((header) => {
            doc.text(header, x, doc.y, { width: colWidth });
            x += colWidth;
          });
          doc.moveDown();

          // Data
          doc.font("Helvetica");
          data.forEach((row, index) => {
            if (doc.y > 700) {
              doc.addPage();
            }
            x = 50;
            headers.forEach((header) => {
              doc.text(String(row[header] || ""), x, doc.y, { width: colWidth });
              x += colWidth;
            });
            doc.moveDown();
          });
        }

        doc.end();
      } else {
        return successResponse(res, data, "Export thành công", 200);
      }
    } catch (error) {
      console.error("Export report error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default statisticsController;
