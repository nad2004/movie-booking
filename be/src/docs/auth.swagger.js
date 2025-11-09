/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng ký tài khoản mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, fullName]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               password: { type: string, example: "password123" }
 *               fullName: { type: string, example: "Nguyen Van A" }
 *               phoneNumber: { type: string, example: "0123456789" }
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */

/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng nhập bằng Google
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Quên mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Đã gửi email reset
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Authentication]
 *     summary: Reset mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Reset thành công
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Users]
 *     summary: Lấy thông tin user hiện tại
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 */

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     tags: [Users]
 *     summary: Đổi mật khẩu
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */

export default {};
