/**
 * @swagger
 * /bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Tạo đơn đặt vé
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [scheduleId, seats]
 *             properties:
 *               scheduleId: { type: string }
 *               seats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     seatNumber: { type: string }
 *                     seatType: { type: string }
 *                     price: { type: number }
 *               voucherCode: { type: string }
 *     responses:
 *       201:
 *         description: Đặt vé thành công
 */

/**
 * @swagger
 * /bookings/my-bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: Lấy danh sách vé của tôi
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
 *         description: Danh sách vé
 */

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Chi tiết đơn vé
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chi tiết vé
 */

/**
 * @swagger
 * /bookings/{id}/confirm-payment:
 *   post:
 *     tags: [Bookings]
 *     summary: Xác nhận thanh toán
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod: { type: string }
 *               transactionId: { type: string }
 *     responses:
 *       200:
 *         description: Xác nhận thành công
 */

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   post:
 *     tags: [Bookings]
 *     summary: Hủy vé
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Hủy vé thành công
 */

export default {};
