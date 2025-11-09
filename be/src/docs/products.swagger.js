/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Lấy tất cả sản phẩm
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm (bắp rang, nước, combo...)
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Chi tiết sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 */

export default {};
