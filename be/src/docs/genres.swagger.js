/**
 * @swagger
 * /genres:
 *   get:
 *     tags:
 *       - Genres
 *     summary: Lấy danh sách thể loại phim (có filter)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên, slug hoặc mô tả thể loại
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Lọc theo trạng thái hoạt động của thể loại
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: displayOrder
 *           enum: [displayOrder, name, createdAt, updatedAt]
 *         description: Trường sắp xếp
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           default: asc
 *           enum: [asc, desc]
 *         description: Thứ tự sắp xếp
 *     responses:
 *       200:
 *         description: Danh sách thể loại
 *       500:
 *         description: Lỗi server
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
