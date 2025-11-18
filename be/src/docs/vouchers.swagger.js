/**
 * @swagger
 * /vouchers/verify:
 *   post:
 *     tags: [Vouchers]
 *     summary: Xác thực mã voucher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code: { type: string, example: "SUMMER2024" }
 *     responses:
 *       200:
 *         description: Voucher hợp lệ
 */

export default {};
