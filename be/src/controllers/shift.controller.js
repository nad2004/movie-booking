import shiftService from "../services/shift-management.service.js";
import catchAsync from "../middlewares/catchAsync.middleware.js";
import { successResponse } from "../utils/response.js";
import Shift from "../models/shift.model.js";

const createShift = catchAsync(async (req, res) => {
  const shift = await shiftService.createShift(req.body);
  successResponse(res, shift, "Shift created successfully", 201);
});

const getShiftsByTheater = catchAsync(async (req, res) => {
  const { theaterId } = req.params;
  const { startDate, endDate } = req.query;
  const shifts = await shiftService.getShiftsByTheater(theaterId, new Date(startDate), new Date(endDate));
  successResponse(res, shifts, "Shifts retrieved successfully");
});

const getShiftsByStaff = catchAsync(async (req, res) => {
  const { staffId } = req.params;
  const { startDate, endDate } = req.query;
  const shifts = await shiftService.getShiftsByStaff(staffId, new Date(startDate), new Date(endDate));
  successResponse(res, shifts, "Shifts retrieved successfully");
});

const checkIn = catchAsync(async (req, res) => {
  const { shiftId } = req.params;
  const shift = await shiftService.checkIn(shiftId, req.body);
  successResponse(res, shift, "Checked in successfully");
});

const checkOut = catchAsync(async (req, res) => {
  const { shiftId } = req.params;
  const shift = await shiftService.checkOut(shiftId, req.body);
  successResponse(res, shift, "Checked out successfully");
});

const requestShiftSwap = catchAsync(async (req, res) => {
  const { shiftId } = req.params;
  const shift = await shiftService.requestShiftSwap(shiftId, { ...req.body, requestedBy: req.user._id });
  successResponse(res, shift, "Shift swap requested successfully");
});

const approveShiftSwap = catchAsync(async (req, res) => {
  const { shiftId } = req.params;
  const { newStaffId } = req.body;
  const shift = await shiftService.approveShiftSwap(shiftId, req.user._id, newStaffId);
  successResponse(res, shift, "Shift swap approved successfully");
});

const getAttendanceReport = catchAsync(async (req, res) => {
  const { theaterId } = req.params;
  const { startDate, endDate } = req.query;
  const report = await shiftService.getAttendanceReport(theaterId, new Date(startDate), new Date(endDate));
  successResponse(res, report, "Attendance report generated successfully");
});

const generateSchedule = catchAsync(async (req, res) => {
  const { theaterId, startDate, endDate, staffList } = req.body;
  const shifts = await shiftService.generateSchedule(theaterId, new Date(startDate), new Date(endDate), staffList);
  successResponse(res, shifts, "Schedule generated successfully", 201);
});

const updateShift = catchAsync(async (req, res) => {
  const { shiftId } = req.params;
  const shift = await Shift.findByIdAndUpdate(shiftId, req.body, { new: true, runValidators: true }).populate([
    "staff",
    "theater",
  ]);
  if (!shift) return res.status(404).json({ message: "Shift not found" });
  successResponse(res, shift, "Shift updated successfully");
});

const deleteShift = catchAsync(async (req, res) => {
  const { shiftId } = req.params;
  const shift = await Shift.findByIdAndUpdate(shiftId, { status: "cancelled" }, { new: true });
  if (!shift) return res.status(404).json({ message: "Shift not found" });
  successResponse(res, shift, "Shift cancelled successfully");
});

export default {
  createShift,
  getShiftsByTheater,
  getShiftsByStaff,
  checkIn,
  checkOut,
  requestShiftSwap,
  approveShiftSwap,
  getAttendanceReport,
  generateSchedule,
  updateShift,
  deleteShift,
};
