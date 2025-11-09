/**
 * @swagger
 * /admin/movies:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo phim mới (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               director: { type: string }
 *               duration: { type: number }
 *     responses:
 *       201:
 *         description: Tạo phim thành công
 */

/**
 * @swagger
 * /admin/bookings:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy tất cả đơn vé (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách đơn vé
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy danh sách users (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách users
 */

/**
 * @swagger
 * /admin/movies/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Cập nhật phim (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     tags: [Admin]
 *     summary: Xóa phim (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

/**
 * @swagger
 * /admin/schedules:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo lịch chiếu (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo lịch chiếu thành công
 */

/**
 * @swagger
 * /admin/schedules/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Cập nhật lịch chiếu (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     tags: [Admin]
 *     summary: Xóa lịch chiếu (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

/**
 * @swagger
 * /admin/theaters:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo rạp chiếu (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo rạp thành công
 */

/**
 * @swagger
 * /admin/genres:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo thể loại (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo thể loại thành công
 */

/**
 * @swagger
 * /admin/products:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo sản phẩm (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 */

/**
 * @swagger
 * /admin/vouchers:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy danh sách vouchers (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách vouchers
 *   post:
 *     tags: [Admin]
 *     summary: Tạo voucher (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo voucher thành công
 */

/**
 * @swagger
 * /admin/bookings/check-in:
 *   post:
 *     tags: [Admin]
 *     summary: Check-in vé tại rạp (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingCode: { type: string }
 *     responses:
 *       200:
 *         description: Check-in thành công
 */

/**
 * @swagger
 * /admin/reviews:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy tất cả đánh giá (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đánh giá
 */

/**
 * @swagger
 * /admin/statistics/overview:
 *   get:
 *     tags: [Admin]
 *     summary: Thống kê tổng quan (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu thống kê
 */

/**
 * @swagger
 * /admin/statistics/revenue:
 *   get:
 *     tags: [Admin]
 *     summary: Thống kê doanh thu (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu doanh thu
 */

export default {};
