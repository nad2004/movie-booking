/**
 * @swagger
 * /bookings/{bookingId}/payment/vnpay:
 *   post:
 *     tags: [Payment]
 *     summary: Tạo thanh toán VNPay
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: URL thanh toán VNPay
 */

/**
 * @swagger
 * /bookings/{bookingId}/payment/momo:
 *   post:
 *     tags: [Payment]
 *     summary: Tạo thanh toán MoMo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: URL thanh toán MoMo
 */

/**
 * @swagger
 * /payment/vnpay-return:
 *   get:
 *     tags: [Payment]
 *     summary: VNPay callback return
 *     responses:
 *       200:
 *         description: Xử lý callback
 */

/**
 * @swagger
 * /payment/momo-return:
 *   get:
 *     tags: [Payment]
 *     summary: MoMo callback return
 *     responses:
 *       200:
 *         description: Xử lý callback
 */

/**
 * @swagger
 * /bookings/{bookingId}/payment/status:
 *   get:
 *     tags: [Payment]
 *     summary: Kiểm tra trạng thái thanh toán
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trạng thái thanh toán
 */

/**
 * @swagger
 * /bookings/{bookingId}/payment/refund:
 *   post:
 *     tags: [Payment]
 *     summary: Hoàn tiền (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Hoàn tiền thành công
 */

export default {};
