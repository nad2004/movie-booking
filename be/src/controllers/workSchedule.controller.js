import mongoose from "mongoose";
import ShiftTemplate from "../models/shiftTemplate.model.js";
import WorkSchedule from "../models/workSchedule.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

// helpers
function combineDateAndTime(dateStr, timeStr) {
  // dateStr: YYYY-MM-DD, timeStr: HH:mm
  // const [y, m, d] = dateStr.split("-").map((v) => parseInt(v, 10));
  // const [hh, mm] = timeStr.split(":").map((v) => parseInt(v, 10));
  // return new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
  return new Date(`${dateStr}T${timeStr}:00+07:00`);
}

function dateRange(fromStr, toStr) {
  const res = [];
  const from = new Date(fromStr + "T00:00:00Z");
  const to = new Date(toStr + "T00:00:00Z");
  for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
    res.push(new Date(d).toISOString().slice(0, 10));
  }
  return res;
}

const workScheduleController = {
  generate: async (req, res) => {
    try {
      let { theaterId, range, templateIds, skipExisting = true } = req.body;

      if (!Array.isArray(templateIds)) {
        if (typeof templateIds === "object") {
          templateIds = Object.values(templateIds);
        } else if (typeof templateIds === "string") {
          templateIds = [templateIds];
        } else {
          return errorResponse(res, "templateIds format invalid", 400);
        }
      }

      if (!theaterId || !range || !range.from || !range.to || !Array.isArray(templateIds)) {
        return errorResponse(res, "Invalid payload", 400);
      }

      if (templateIds.length === 0) {
        return errorResponse(res, "templateIds cannot be empty", 400);
      }

      // fetch templates
      const templates = await ShiftTemplate.find({ _id: { $in: templateIds }, isActive: true }).lean();
      const created = [];
      const skipped = [];

      const dates = dateRange(range.from, range.to);

      for (const date of dates) {
        for (const tpl of templates) {
          const startDateTime = combineDateAndTime(date, tpl.startTime);
          let endDateTime = combineDateAndTime(date, tpl.endTime);
          if (endDateTime <= startDateTime) {
            // overnight shift -> add 1 day
            endDateTime = new Date(endDateTime.getTime() + 24 * 60 * 60 * 1000);
          }

          if (skipExisting) {
            const existing = await WorkSchedule.findOne({ theaterId, date, shiftTemplateId: tpl._id }).lean();
            if (existing) {
              skipped.push({ date, templateId: tpl._id });
              continue;
            }
          }

          const doc = {
            date,
            theaterId,
            shiftTemplateId: tpl._id,
            startDateTime,
            endDateTime,
            createdBy: req.userId,
          };

          const createdDoc = await WorkSchedule.create(doc);
          created.push(createdDoc._id.toString());
        }
      }

      return successResponse(res, { created, skipped }, "Schedules generated", 201);
    } catch (err) {
      console.error("Generate schedules error:", err);
      return errorResponse(res, err.message || "Lỗi server", 500);
    }
  },

  list: async (req, res) => {
    try {
      const { theaterId, from, to } = req.query;
      const q = {};
      if (theaterId) q.theaterId = new mongoose.Types.ObjectId(theaterId);
      if (from && to) {
        q.startDateTime = { $gte: new Date(from) };
        q.endDateTime = { $lte: new Date(to) };
      }
      // const schedules = await WorkSchedule.find(q).sort({ startDateTime: 1 }).lean();
      const schedules = await WorkSchedule.find(q)
        .populate("theaterId", "name")
        .populate("shiftTemplateId", "name startTime endTime")
        .sort({ startDateTime: 1 })
        .lean();

      // Group schedules by date
      const grouped = schedules.reduce((acc, item) => {
        if (!acc[item.date]) acc[item.date] = [];
        acc[item.date].push(item);
        return acc;
      }, {});

      // Convert to array format
      const result = Object.keys(grouped).map((date) => ({
        date,
        shifts: grouped[date],
      }));

      return successResponse(res, result);
    } catch (err) {
      console.error("List schedules error:", err);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  roster: async (req, res) => {
    try {
      const { theaterId } = req.params;
      const { from, to } = req.query;
      if (!from || !to) return errorResponse(res, "from/to required", 400);

      // const schedules = await WorkSchedule.find({ theaterId, date: { $gte: from, $lte: to } })
      //   .populate("shiftTemplateId")
      //   .lean();
      const schedules = await WorkSchedule.find({
        theaterId,
        date: { $gte: from, $lte: to },
      })
        .populate("theaterId", "name")
        .populate("shiftTemplateId", "name startTime endTime")
        .lean();

      // group by date then templates
      const dates = Array.from(new Set(schedules.map((s) => s.date))).sort();
      const shiftsByDate = dates.map((date) => ({ date, templates: [] }));

      for (const dateEntry of shiftsByDate) {
        const items = schedules.filter((s) => s.date === dateEntry.date);
        for (const it of items) {
          dateEntry.templates.push({
            id: it._id,
            template: it.shiftTemplateId,
            assignments: [], // assignments fetched separately if needed
            startDateTime: it.startDateTime,
            endDateTime: it.endDateTime,
            status: it.status,
          });
        }
      }

      return successResponse(res, { dates, shifts: shiftsByDate });
    } catch (err) {
      console.error("Roster error:", err);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default workScheduleController;
