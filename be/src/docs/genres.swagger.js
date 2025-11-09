/**
 * @swagger
 * /genres:
 *   get:
 *     tags: [Genres]
 *     summary: Lấy tất cả thể loại phim
 *     responses:
 *       200:
 *         description: Danh sách thể loại
 */

/**
 * @swagger
 * /genres/{id}:
 *   get:
 *     tags: [Genres]
 *     summary: Chi tiết thể loại
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chi tiết thể loại
 */

export default {};
