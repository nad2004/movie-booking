/**
 * @swagger
 * /theaters:
 *   get:
 *     tags: [Theaters]
 *     summary: Lấy tất cả rạp chiếu
 *     responses:
 *       200:
 *         description: Danh sách rạp
 */

/**
 * @swagger
 * /theaters/{id}:
 *   get:
 *     tags: [Theaters]
 *     summary: Chi tiết rạp chiếu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chi tiết rạp
 */

/**
 * @swagger
 * /theaters/city/{city}:
 *   get:
 *     tags: [Theaters]
 *     summary: Rạp theo thành phố
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách rạp theo thành phố
 */

export default {};
