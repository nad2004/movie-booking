/**
 * @swagger
 * /movies:
 *   get:
 *     tags: [Movies]
 *     summary: Lấy danh sách phim
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Sắp chiếu, Đang chiếu, Ngừng chiếu] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách phim
 */

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     tags: [Movies]
 *     summary: Lấy chi tiết phim
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chi tiết phim
 */

/**
 * @swagger
 * /movies/now-showing:
 *   get:
 *     tags: [Movies]
 *     summary: Phim đang chiếu
 *     responses:
 *       200:
 *         description: Danh sách phim đang chiếu
 */

/**
 * @swagger
 * /movies/upcoming:
 *   get:
 *     tags: [Movies]
 *     summary: Phim sắp chiếu
 *     responses:
 *       200:
 *         description: Danh sách phim sắp chiếu
 */

/**
 * @swagger
 * /movies/genre/{genreId}:
 *   get:
 *     tags: [Movies]
 *     summary: Lấy phim theo thể loại
 *     parameters:
 *       - in: path
 *         name: genreId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách phim theo thể loại
 */

export default {};
