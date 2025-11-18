/**
 * @swagger
 * /admin/movies:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo phim mới (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - duration
 *               - releaseDate
 *               - director
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Avengers: Endgame"
 *               slug:
 *                 type: string
 *                 example: "avengers-endgame"
 *               description:
 *                 type: string
 *                 example: "Sau sự kiện tàn khốc của Infinity War..."
 *               duration:
 *                 type: number
 *                 example: 181
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-04-26"
 *               director:
 *                 type: string
 *                 example: "Anthony Russo, Joe Russo"
 *               actors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"]
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["69198f14b80a32bf8ea5d916", "69198f14b80a32bf8ea5d912"]
 *               language:
 *                 type: string
 *                 example: "English"
 *               subtitles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Vietnamese"]
 *               rating:
 *                 type: string
 *                 example: "C13"
 *               posterUrl:
 *                 type: string
 *                 example: "https://image.tmdb.org/t/p/w500/poster.jpg"
 *               trailerUrl:
 *                 type: string
 *                 example: "https://www.youtube.com/watch?v=TcMBFSGVi1c"
 *               status:
 *                 type: string
 *                 enum: [Sắp chiếu, Đang chiếu, Ngừng chiếu]
 *                 example: "Đang chiếu"
 *     responses:
 *       201:
 *         description: Tạo phim thành công
 */

/**
 * @swagger
 * /admin/bookings:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy tất cả đơn vé (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách đơn vé
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy danh sách users (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách users
 */

/**
 * @swagger
 * /admin/movies/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Cập nhật phim (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               director:
 *                 type: string
 *               actors:
 *                 type: array
 *                 items:
 *                   type: string
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               language:
 *                 type: string
 *               subtitles:
 *                 type: array
 *                 items:
 *                   type: string
 *               rating:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *               trailerUrl:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Sắp chiếu, Đang chiếu, Ngừng chiếu]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     tags: [Admin]
 *     summary: Xóa phim (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

/**
 * @swagger
 * /admin/schedules:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo lịch chiếu (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - theaterId
 *               - roomId
 *               - showDate
 *               - startTime
 *               - endTime
 *               - ticketPrices
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "69198f14b80a32bf8ea5d92f"
 *               theaterId:
 *                 type: string
 *                 example: "69198f14b80a32bf8ea5d920"
 *               roomId:
 *                 type: string
 *                 example: "69198f14b80a32bf8ea5d921"
 *               roomName:
 *                 type: string
 *                 example: "Phòng 1"
 *               roomType:
 *                 type: string
 *                 example: "2D"
 *               showDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-25"
 *               startTime:
 *                 type: string
 *                 example: "19:00"
 *               endTime:
 *                 type: string
 *                 example: "21:30"
 *               ticketPrices:
 *                 type: object
 *                 properties:
 *                   standard:
 *                     type: number
 *                     example: 80000
 *                   vip:
 *                     type: number
 *                     example: 120000
 *                   couple:
 *                     type: number
 *                     example: 200000
 *               language:
 *                 type: string
 *                 example: "English"
 *               subtitles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Vietnamese"]
 *     responses:
 *       201:
 *         description: Tạo lịch chiếu thành công
 */

/**
 * @swagger
 * /admin/schedules/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Cập nhật lịch chiếu (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               showDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               ticketPrices:
 *                 type: object
 *                 properties:
 *                   standard:
 *                     type: number
 *                   vip:
 *                     type: number
 *                   couple:
 *                     type: number
 *               language:
 *                 type: string
 *               subtitles:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [Sắp chiếu, Đang chiếu, Đã chiếu, Đã hủy]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     tags: [Admin]
 *     summary: Xóa lịch chiếu (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

/**
 * @swagger
 * /admin/theaters:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo rạp chiếu (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - city
 *             properties:
 *               name:
 *                 type: string
 *                 example: "CGV Vincom"
 *               slug:
 *                 type: string
 *                 example: "cgv-vincom"
 *               address:
 *                 type: string
 *                 example: "191 Bà Triệu, Hai Bà Trưng, Hà Nội"
 *               city:
 *                 type: string
 *                 example: "Hà Nội"
 *               phoneNumber:
 *                 type: string
 *                 example: "1900601700"
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "Point"
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [105.8342, 21.0278]
 *               openingHours:
 *                 type: string
 *                 example: "08:00 - 23:00"
 *     responses:
 *       201:
 *         description: Tạo rạp thành công
 */

/**
 * @swagger
 * /admin/theaters/{theaterId}/rooms:
 *   post:
 *     tags: [Admin]
 *     summary: Thêm phòng chiếu vào rạp (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: theaterId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomName
 *               - roomType
 *               - totalSeats
 *               - rows
 *               - seatsPerRow
 *               - seatMap
 *             properties:
 *               roomName:
 *                 type: string
 *                 example: "Phòng 1"
 *               roomType:
 *                 type: string
 *                 enum: [2D, 3D, IMAX, 4DX]
 *                 example: "2D"
 *               totalSeats:
 *                 type: number
 *                 example: 100
 *               rows:
 *                 type: number
 *                 example: 10
 *               seatsPerRow:
 *                 type: number
 *                 example: 10
 *               seatMap:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     seatNumber:
 *                       type: string
 *                       example: "A1"
 *                     seatType:
 *                       type: string
 *                       enum: [Thường, VIP, Ghế đôi]
 *                       example: "Thường"
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *                     row:
 *                       type: string
 *                       example: "A"
 *                     column:
 *                       type: number
 *                       example: 1
 *               screenType:
 *                 type: string
 *                 example: "Standard"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Thêm phòng chiếu thành công
 */

/**
 * @swagger
 * /admin/theaters/{theaterId}/rooms/{roomId}:
 *   put:
 *     tags: [Admin]
 *     summary: Cập nhật phòng chiếu (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: theaterId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomName:
 *                 type: string
 *               roomType:
 *                 type: string
 *                 enum: [2D, 3D, IMAX, 4DX]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật phòng chiếu thành công
 *   delete:
 *     tags: [Admin]
 *     summary: Xóa phòng chiếu (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: theaterId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Xóa phòng chiếu thành công
 */

/**
 * @swagger
 * /admin/genres:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo thể loại (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Hành động"
 *               slug:
 *                 type: string
 *                 example: "hanh-dong"
 *               description:
 *                 type: string
 *                 example: "Phim hành động gay cấn"
 *               icon:
 *                 type: string
 *                 example: "🎬"
 *               color:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Tạo thể loại thành công
 */

/**
 * @swagger
 * /admin/products:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo sản phẩm (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bắp rang bơ lớn"
 *               slug:
 *                 type: string
 *                 example: "bap-rang-bo-lon"
 *               description:
 *                 type: string
 *                 example: "Bắp rang bơ thơm ngon"
 *               category:
 *                 type: string
 *                 enum: [Popcorn, Drink, Combo, Snack]
 *                 example: "Popcorn"
 *               price:
 *                 type: number
 *                 example: 50000
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/popcorn.jpg"
 *               inStock:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 */

/**
 * @swagger
 * /admin/vouchers:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy danh sách vouchers (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách vouchers
 *   post:
 *     tags: [Admin]
 *     summary: Tạo voucher (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - description
 *               - discountType
 *               - discountValue
 *               - startDate
 *               - endDate
 *               - usageLimit
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SUMMER2024"
 *               description:
 *                 type: string
 *                 example: "Giảm giá mùa hè"
 *               discountType:
 *                 type: string
 *                 enum: [fixed, percent]
 *                 example: "percent"
 *               discountValue:
 *                 type: number
 *                 example: 20
 *               maxDiscountAmount:
 *                 type: number
 *                 example: 50000
 *               minOrderValue:
 *                 type: number
 *                 example: 100000
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-31"
 *               usageLimit:
 *                 type: number
 *                 example: 100
 *               usageLimitPerUser:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tạo voucher thành công
 */

/**
 * @swagger
 * /admin/bookings/check-in:
 *   post:
 *     tags: [Admin]
 *     summary: Check-in vé tại rạp (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingCode: { type: string }
 *     responses:
 *       200:
 *         description: Check-in thành công
 */

/**
 * @swagger
 * /admin/reviews:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy tất cả đánh giá (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đánh giá
 */

/**
 * @swagger
 * /admin/statistics/overview:
 *   get:
 *     tags: [Admin]
 *     summary: Thống kê tổng quan (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu thống kê
 */

/**
 * @swagger
 * /admin/statistics/revenue:
 *   get:
 *     tags: [Admin]
 *     summary: Thống kê doanh thu (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu doanh thu
 */

export default {};
