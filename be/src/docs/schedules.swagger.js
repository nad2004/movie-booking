/**
 * @swagger
 * /schedules:
 *   get:
 *     tags: [Schedules]
 *     summary: Lấy tất cả lịch chiếu
 *     parameters:
 *       - in: query
 *         name: movieId
 *         schema: { type: string }
 *       - in: query
 *         name: theaterId
 *         schema: { type: string }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Danh sách lịch chiếu
 */

/**
 * @swagger
 * /schedules/movie/{movieId}:
 *   get:
 *     tags: [Schedules]
 *     summary: Lịch chiếu theo phim
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lịch chiếu của phim
 */

/**
 * @swagger
 * /schedules/theater/{theaterId}:
 *   get:
 *     tags: [Schedules]
 *     summary: Lịch chiếu theo rạp
 *     parameters:
 *       - in: path
 *         name: theaterId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lịch chiếu của rạp
 */

/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *     tags: [Schedules]
 *     summary: Chi tiết lịch chiếu
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chi tiết lịch chiếu
 */

export default {};
