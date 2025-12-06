import mongoose from "mongoose";
import ShiftAssignment from "../models/shiftAssignment.model.js";
import WorkSchedule from "../models/workSchedule.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

function intervalsOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

const shiftAssignmentController = {
  bulkAssign: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const results = { created: [], failed: [] };
    try {
      let { theaterId, assignments } = req.body;

      if (assignments && typeof assignments === "object" && !Array.isArray(assignments)) {
        assignments = Object.values(assignments);
        req.body.assignments = assignments;
      }

      if (!theaterId || !Array.isArray(assignments)) return errorResponse(res, "Invalid payload", 400);

      if (assignments.length === 0) return errorResponse(res, "assignments cannot be empty", 400);

      for (const item of assignments) {
        try {
          const schedule = await WorkSchedule.findById(item.workScheduleId).session(session);
          if (!schedule) throw new Error("Schedule not found");
          if (String(schedule.theaterId) !== String(theaterId)) throw new Error("Schedule theater mismatch");
          if (schedule.status !== "open") throw new Error("Schedule not open");

          // check overlap for the user
          const existingAssignments = await ShiftAssignment.find({ userId: item.userId })
            .populate({ path: "workScheduleId", select: "startDateTime endDateTime theaterId" })
            .session(session);

          const hasOverlap = existingAssignments.some((ex) => {
            if (!ex.workScheduleId) return false;
            return intervalsOverlap(
              schedule.startDateTime,
              schedule.endDateTime,
              ex.workScheduleId.startDateTime,
              ex.workScheduleId.endDateTime
            );
          });

          if (hasOverlap) throw new Error("User has overlapping assignment");

          const created = await ShiftAssignment.create(
            [
              {
                workScheduleId: item.workScheduleId,
                userId: item.userId,
                role: item.role,
                assignedBy: req.userId,
              },
            ],
            { session }
          );

          results.created.push(created[0]);
        } catch (innerErr) {
          results.failed.push({ item, reason: innerErr.message });
        }
      }

      await session.commitTransaction();
      return successResponse(res, results);
    } catch (err) {
      await session.abortTransaction();
      console.error("Bulk assign error:", err);
      return errorResponse(res, err.message || "Lỗi server", 500);
    } finally {
      session.endSession();
    }
  },

  listBySchedule: async (req, res) => {
    try {
      const { scheduleId } = req.params;
      const items = await ShiftAssignment.find({ workScheduleId: scheduleId }).populate("userId", "name email").lean();
      return successResponse(res, items);
    } catch (err) {
      console.error("List assignments error:", err);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  checkIn: async (req, res) => {
    try {
      const userId = req.userId;
      const { workScheduleId } = req.body;

      let assignment = null;

      if (workScheduleId) {
        // assignment = await ShiftAssignment.findOne({ userId, workScheduleId });
        assignment = await ShiftAssignment.findOne({ userId, workScheduleId }).populate("workScheduleId");
        // Debug
        if (!assignment) {
          const allAssignments = await ShiftAssignment.find({ workScheduleId }).populate("userId", "email fullName");
          console.log("Check-in debug:", {
            userId,
            workScheduleId,
            foundAssignments: allAssignments.length,
            assignments: allAssignments.map((a) => ({
              userId: a.userId?._id,
              email: a.userId?.email,
              status: a.status,
            })),
          });
        }
      } else {
        // find pending assignment within +/-30 minutes
        const now = new Date();
        const windowStart = new Date(now.getTime() - 30 * 60 * 1000);
        const windowEnd = new Date(now.getTime() + 30 * 60 * 1000);

        const candidates = await ShiftAssignment.find({ userId, status: "pending" })
          .populate({ path: "workScheduleId", match: { startDateTime: { $gte: windowStart, $lte: windowEnd } } })
          .sort({ assignedAt: 1 });

        assignment = candidates.find((c) => c.workScheduleId);
      }

      if (!assignment) return errorResponse(res, "No eligible assignment found", 404);

      // update
      // assignment.checkInTime = new Date();
      // assignment.status = "active";
      // await assignment.save();

      // return successResponse(res, { assignmentId: assignment._id, checkInTime: assignment.checkInTime });

      // ==== CHECK 1: Phải đúng ngày ====
      const today = new Date().toISOString().slice(0, 10);
      if (assignment.workScheduleId.date !== today) {
        return errorResponse(res, "Không thể check-in: Không đúng ngày làm việc", 400);
      }

      // ==== CHECK 2: Phải đúng giờ ca ====
      const now = new Date();
      const start = new Date(assignment.workScheduleId.startDateTime);
      const end = new Date(assignment.workScheduleId.endDateTime);

      // Cho phép check-in sớm 30 phút
      const allowedEarly = 30 * 60 * 1000;

      if (now < start - allowedEarly) {
        return errorResponse(res, "Chưa đến giờ check-in", 400);
      }

      if (now > end) {
        return errorResponse(res, "Đã quá giờ check-in của ca này", 400);
      }

      // ==== CHECK 3: Không được check-in nếu đã active/completed ====
      if (assignment.status !== "pending") {
        return errorResponse(res, "Bạn đã check-in hoặc đã hoàn thành ca", 400);
      }

      // === SUCCESS ===
      assignment.checkInTime = now;
      assignment.status = "active";
      await assignment.save();

      return successResponse(res, {
        assignmentId: assignment._id,
        checkInTime: now,
      });
    } catch (err) {
      console.error("Check-in error:", err);
      return errorResponse(res, err.message || "Lỗi server", 500);
    }
  },

  checkOut: async (req, res) => {
    try {
      const userId = req.userId;
      const { workScheduleId } = req.body;

      let assignment = null;
      if (workScheduleId) {
        // assignment = await ShiftAssignment.findOne({ userId, workScheduleId, status: "active" });
        assignment = await ShiftAssignment.findOne({ userId, workScheduleId, status: "active" }).populate(
          "workScheduleId"
        );
        // Debug: check if assignment exists with different status
        if (!assignment) {
          const anyAssignment = await ShiftAssignment.findOne({ userId, workScheduleId });
          console.log("Check-out debug:", {
            userId,
            workScheduleId,
            found: !!anyAssignment,
            status: anyAssignment?.status,
          });
        }
      } else {
        // assignment = await ShiftAssignment.findOne({ userId, status: "active" }).sort({ checkInTime: -1 });
        assignment = await ShiftAssignment.findOne({ userId, status: "active" })
          .populate("workScheduleId")
          .sort({ checkInTime: -1 });
      }

      if (!assignment) return errorResponse(res, "No active assignment found", 404);

      // assignment.checkOutTime = new Date();
      // assignment.status = "completed";
      // await assignment.save();

      // return successResponse(res, { assignmentId: assignment._id, checkOutTime: assignment.checkOutTime });

      const now = new Date();
      const start = new Date(assignment.workScheduleId.startDateTime);
      const end = new Date(assignment.workScheduleId.endDateTime);

      // ==== CHECK 1: Không checkout nếu chưa check-in ====
      if (assignment.status !== "active") {
        return errorResponse(res, "Bạn chưa check-in ca này", 400);
      }

      // ==== CHECK 2: Không được checkout trước giờ bắt đầu ====
      if (now < start) {
        return errorResponse(res, "Chưa đến giờ checkout", 400);
      }

      // ==== CHECK 3: Cho phép checkout trong vòng 2 giờ sau ca ====
      const allowedLate = 2 * 60 * 60 * 1000;
      if (now > end.getTime() + allowedLate) {
        return errorResponse(res, "Đã quá giờ checkout cho phép", 400);
      }

      // === SUCCESS ===
      assignment.checkOutTime = now;
      assignment.status = "completed";
      await assignment.save();

      return successResponse(res, {
        assignmentId: assignment._id,
        checkOutTime: now,
      });
    } catch (err) {
      console.error("Check-out error:", err);
      return errorResponse(res, err.message || "Lỗi server", 500);
    }
  },

  listByUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20, from, to, date } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // 1. Điều kiện lọc cơ bản: Phải đúng User
      const matchStage = {
        userId: new mongoose.Types.ObjectId(userId),
      };

      // 2. Pipeline Aggregation
      const pipeline = [
        // Bước 1: Lọc theo userId
        { $match: matchStage },

        // Bước 2: Join với bảng WorkSchedule để lấy thông tin lịch
        {
          $lookup: {
            from: "workschedules",
            localField: "workScheduleId",
            foreignField: "_id",
            as: "schedule",
          },
        },
        { $unwind: "$schedule" }, // Bung mảng ra object

        // Bước 3: Join với Theater để lấy tên rạp
        {
          $lookup: {
            from: "theaters",
            localField: "schedule.theaterId",
            foreignField: "_id",
            as: "theater",
          },
        },
        {
          $unwind: { path: "$theater", preserveNullAndEmptyArrays: true },
        },

        // Bước 4: Join với ShiftTemplate (để lấy Color và làm dữ liệu dự phòng - Fallback)
        {
          $lookup: {
            from: "shifttemplates",
            localField: "schedule.shiftTemplateId",
            foreignField: "_id",
            as: "template",
          },
        },
        {
          $unwind: { path: "$template", preserveNullAndEmptyArrays: true },
        },
      ];

      // 3. Xử lý lọc theo ngày (nếu có params)
      // Lưu ý: Filter phải đặt SAU khi lookup WorkSchedule
      if (date) {
        // Tìm chính xác ngày (String YYYY-MM-DD)
        pipeline.push({
          $match: { "schedule.date": date },
        });
      } else if (from && to) {
        // Tìm theo khoảng thời gian
        pipeline.push({
          $match: {
            "schedule.startDateTime": {
              $gte: new Date(from),
              $lte: new Date(to),
            },
          },
        });
      }

      // 4. Sắp xếp: Lịch mới nhất lên đầu (hoặc sắp diễn ra)
      pipeline.push({ $sort: { "schedule.startDateTime": -1 } });

      // 5. Phân trang & Định dạng dữ liệu trả về (Facet)
      pipeline.push({
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: limitNum },
            {
              $project: {
                _id: 1,
                role: 1,
                status: 1,
                checkInTime: 1,
                checkOutTime: 1,
                assignedAt: 1,

                workScheduleId: "$schedule._id",
                theaterId: "$theater._id", 
                shiftTemplateId: "$template._id",

                date: "$schedule.date",
                startDateTime: "$schedule.startDateTime",
                endDateTime: "$schedule.endDateTime",
                theaterName: "$theater.name",

                // Ưu tiên lấy từ Schedule (Snapshot), nếu null lấy từ Template
                shiftName: { $ifNull: ["$schedule.shiftName", "$template.name"] },
                shiftCode: { $ifNull: ["$schedule.shiftCode", "$template.code"] },
                startTime: { $ifNull: ["$schedule.startTime", "$template.startTime"] },
                endTime: { $ifNull: ["$schedule.endTime", "$template.endTime"] },

                color: { $ifNull: ["$template.color", "#2b6cb0"] },
              },
            },
          ],
        },
      });

      const result = await ShiftAssignment.aggregate(pipeline);

      const data = result[0].data;
      const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
      const totalPages = Math.ceil(total / limitNum);

      return successResponse(res, {
        assignments: data,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
        },
      });
    } catch (err) {
      console.error("List assignments by user error:", err);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  remove: async (req, res) => {
    try {
      const { id } = req.params;
      // 1. Tìm phân công
      const assignment = await ShiftAssignment.findById(id);
      if (!assignment) {
        return errorResponse(res, "Không tìm thấy phân công", 404);
      }
      // 2. Kiểm tra điều kiện an toàn
      // Nếu nhân viên đã check-in hoặc đang làm, không cho xóa cứng để bảo toàn lịch sử lương
      if (assignment.checkInTime || assignment.status === "active" || assignment.status === "completed") {
        return errorResponse(res, "Không thể hủy phân công này vì nhân viên đã check-in hoặc hoàn thành ca.", 400);
      }
      // 3. Xóa
      await ShiftAssignment.findByIdAndDelete(id);
      return successResponse(res, null, "Đã hủy phân công thành công");
    } catch (err) {
      console.error("Remove assignment error:", err);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default shiftAssignmentController;
