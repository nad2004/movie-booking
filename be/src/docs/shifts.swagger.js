/**
 * @swagger
 * tags:
 *   - name: ShiftTemplates
 *     description: Quản lý cấu hình ca làm việc (shift template)
 *   - name: WorkSchedules
 *     description: Lập kế hoạch lịch làm việc
 *   - name: ShiftAssignments
 *     description: Phân công nhân sự và chấm công
 */

/* ============================================================
   SHIFT TEMPLATES
   ============================================================ */

/**
 * @swagger
 * /shift-templates:
 *   get:
 *     tags: [ShiftTemplates]
 *     summary: Lấy danh sách ca mẫu
 *     description: Lấy tất cả ca mẫu, có thể lọc theo trạng thái hoạt động (active=true/false).
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Lọc ca mẫu đang hoạt động hay không
 *     responses:
 *       200:
 *         description: Danh sách ca mẫu
 *   post:
 *     tags: [ShiftTemplates]
 *     summary: Tạo ca mẫu mới
 *     description: Chỉ admin/super-admin có quyền tạo ca mẫu.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, startTime, endTime]
 *             properties:
 *               code:
 *                 type: string
 *                 example: "S1"
 *               name:
 *                 type: string
 *                 example: "Ca sáng"
 *               startTime:
 *                 type: string
 *                 example: "08:00"
 *               endTime:
 *                 type: string
 *                 example: "16:00"
 *     responses:
 *       201:
 *         description: Tạo ca mẫu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /shift-templates/{id}:
 *   get:
 *     tags: [ShiftTemplates]
 *     summary: Lấy thông tin ca mẫu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin ca mẫu
 *       404:
 *         description: Không tìm thấy ca mẫu
 *
 *   put:
 *     tags: [ShiftTemplates]
 *     summary: Cập nhật ca mẫu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy ca mẫu
 *
 *   delete:
 *     tags: [ShiftTemplates]
 *     summary: Vô hiệu hóa (soft-delete) ca mẫu
 *     description: isActive sẽ bị chuyển thành false
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã vô hiệu hóa ca mẫu
 *       404:
 *         description: Không tìm thấy ca mẫu
 */


/* ============================================================
   WORK SCHEDULES
   ============================================================ */

/**
 * @swagger
 * /work-schedules/generate:
 *   post:
 *     tags: [WorkSchedules]
 *     summary: Sinh lịch làm việc cho rạp theo dải ngày
 *     description: Tạo lịch làm việc dựa trên danh sách ca mẫu trong khoảng thời gian chỉ định.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [theaterId, range, templateIds]
 *             properties:
 *               theaterId:
 *                 type: string
 *               range:
 *                 type: object
 *                 required: [from, to]
 *                 properties:
 *                   from:
 *                     type: string
 *                     example: "2025-12-01"
 *                   to:
 *                     type: string
 *                     example: "2025-12-07"
 *               templateIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               skipExisting:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Sinh lịch thành công
 *       400:
 *         description: Payload không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /work-schedules:
 *   get:
 *     tags: [WorkSchedules]
 *     summary: Lấy danh sách lịch làm việc
 *     description: Lọc theo rạp hoặc theo khoảng thời gian.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: theaterId
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách lịch làm việc
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /theaters/{theaterId}/roster:
 *   get:
 *     tags: [WorkSchedules]
 *     summary: Lấy bảng phân ca (roster) theo ngày
 *     description: Trả về danh sách ca theo từng ngày của rạp.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: theaterId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dữ liệu roster
 *       400:
 *         description: Thiếu tham số from/to
 *       500:
 *         description: Lỗi server
 */

/* ============================================================
   SHIFT ASSIGNMENTS
   ============================================================ */

/**
 * @swagger
 * /assignments/bulk:
 *   post:
 *     tags: [ShiftAssignments]
 *     summary: Phân công nhân sự hàng loạt
 *     description: Gán nhân viên vào nhiều lịch cùng lúc. Kiểm tra trùng ca, trùng rạp và trạng thái ca.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [theaterId, assignments]
 *             properties:
 *               theaterId:
 *                 type: string
 *               assignments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [workScheduleId, userId, role]
 *                   properties:
 *                     workScheduleId:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     role:
 *                       type: string
 *     responses:
 *       200:
 *         description: Kết quả phân công
 *       400:
 *         description: Payload không hợp lệ
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /schedules/{scheduleId}/assignments:
 *   get:
 *     tags: [ShiftAssignments]
 *     summary: Lấy danh sách phân công theo lịch
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách phân công của lịch
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /assignments/check-in:
 *   post:
 *     tags: [ShiftAssignments]
 *     summary: Nhân viên check-in ca làm
 *     description: Nếu không truyền workScheduleId, hệ thống sẽ tự tìm ca trong phạm vi ±30 phút.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workScheduleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Check-in thành công
 *       404:
 *         description: Không có ca phù hợp
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /assignments/check-out:
 *   post:
 *     tags: [ShiftAssignments]
 *     summary: Nhân viên check-out ca làm
 *     description: Nếu không truyền workScheduleId, hệ thống tự chọn ca đang active gần nhất.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workScheduleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Check-out thành công
 *       404:
 *         description: Không tìm thấy ca đang active
 *       500:
 *         description: Lỗi server
 */

export default {};
