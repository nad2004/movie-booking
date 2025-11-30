/**
 * @swagger
 * /user/profile:
 *   put:
 *     tags: [Users]
 *     summary: Cập nhật thông tin cá nhân
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
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

/**
 * @swagger
 * /user/spending-stats:
 *   get:
 *     tags: [Users]
 *     summary: Lấy thống kê chi tiêu của chính người dùng
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê chi tiêu
 *       500:
 *         description: Lỗi server
 */


export default {};
