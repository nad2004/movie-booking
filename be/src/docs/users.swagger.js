/**
 * @swagger
 * /users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Cập nhật profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               phoneNumber: { type: string }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /users/loyalty-points:
 *   get:
 *     tags: [Users]
 *     summary: Xem điểm tích lũy
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin điểm tích lũy
 */

export default {};
