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

/**
 * @swagger
 * /user/verify-age:
 *   post:
 *     tags: [Users]
 *     summary: Xác minh độ tuổi người dùng (demo CCCD)
 *     description: >
 *       API mô phỏng xác minh độ tuổi người dùng thông qua CCCD demo.
 *       Hệ thống sẽ random mức độ tuổi đã xác minh (từ 10 đến 100) và lưu vào hồ sơ người dùng.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - demo_cccd
 *             properties:
 *               demo_cccd:
 *                 type: string
 *                 example: "012345678901"
 *                 description: CCCD demo dùng để xác minh độ tuổi
 *     responses:
 *       200:
 *         description: Xác minh độ tuổi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Xác minh độ tuổi thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     verified_age_level:
 *                       type: number
 *                       example: 25
 *                       description: Mức độ tuổi đã xác minh
 *                     age_verified_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-23T02:15:30.000Z"
 *       400:
 *         description: Thiếu CCCD demo
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /user/age-status:
 *   get:
 *     tags: [Users]
 *     summary: Xem trạng thái xác minh độ tuổi
 *     description: Lấy thông tin về mức độ tuổi đã xác minh của người dùng (nếu có).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin xác minh độ tuổi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     verified_age_level:
 *                       type: number
 *                       nullable: true
 *                       example: 25
 *                       description: Mức độ tuổi đã xác minh (null nếu chưa xác minh)
 *                     age_verified_at:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: "2025-12-23T02:15:30.000Z"
 *                     is_verified:
 *                       type: boolean
 *                       example: true
 *                       description: Trạng thái đã xác minh hay chưa
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */


export default {};
