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
 *               scheduleId:
 *                 type: string
 *                 example: "6919ab92a5ca4e33ac76e928"
 *               seats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     seatNumber:
 *                       type: string
 *                       example: "A1"
 *                     seatType:
 *                       type: string
 *                       example: "VIP"
 *                     price:
 *                       type: number
 *                       example: 120000
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "69198f14b80a32bf8ea5d920"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     size:
 *                       type: string
 *                       enum: [S, M, L, N/A]
 *                       example: "L"
 *               voucherCode:
 *                 type: string
 *                 example: "SUMMER2024"
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
