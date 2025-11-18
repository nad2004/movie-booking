/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff profile và operations
 */

/**
 * @swagger
 * /staff/profile:
 *   get:
 *     tags: [Staff]
 *     summary: Lấy profile nhân viên
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Staff profile
 *       401:
 *         description: Unauthorized
 *   put:
 *     tags: [Staff]
 *     summary: Cập nhật profile nhân viên
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
*/

/**
 * @swagger
 * /staff/dashboard:
 *   get:
 *     tags: [Staff]
 *     summary: Lấy dashboard data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *       401:
 *         description: Unauthorized
*/

/**
 * @swagger
 * /staff/theater:
 *   get:
 *     tags: [Staff]
 *     summary: Lấy thông tin rạp được assign
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Theater info
 *       401:
 *         description: Unauthorized
*/

/**
 * @swagger
 * /staff/permissions/{permission}:
 *   get:
 *     tags: [Staff]
 *     summary: Kiểm tra permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: permission
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission check result
 *       401:
 *         description: Unauthorized
*/
export default {};
