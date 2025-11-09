import express from "express";

// Import controllers
import authController from "../controllers/auth.controller.js";
import movieController from "../controllers/movie.controller.js";
import scheduleController from "../controllers/schedule.controller.js";
import bookingController from "../controllers/booking.controller.js";
import theaterController from "../controllers/theater.controller.js";
import genreController from "../controllers/genre.controller.js";
import reviewController from "../controllers/review.controller.js";
import userController from "../controllers/user.controller.js";
import productController from "../controllers/product.controller.js";
import voucherController from "../controllers/voucher.controller.js";
import paymentController from "../controllers/payment.controller.js";
import uploadController from "../controllers/upload.controller.js";
import statisticsController from "../controllers/statistics.controller.js";

// Import middleware
import { authenticateToken, authorize, optionalAuth } from "../middlewares/auth.middleware.js";
import uploadMiddleware from "../middlewares/upload.middleware.js";

const router = express.Router();

// ============================================
// PUBLIC ROUTES (Không cần authentication)
// ============================================

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/google-login", authController.googleLogin);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);

router.get("/movies", movieController.getAllMovies);
router.get("/movies/now-showing", movieController.getNowShowingMovies);
router.get("/movies/upcoming", movieController.getUpcomingMovies);
router.get("/movies/:id", movieController.getMovieById);
router.get("/movies/genre/:genreId", movieController.getMoviesByGenre);

// Schedule routes (public)
router.get("/schedules", scheduleController.getAllSchedules);
router.get("/schedules/movie/:movieId", scheduleController.getSchedulesByMovie);
router.get("/schedules/theater/:theaterId", scheduleController.getSchedulesByTheater);
router.get("/schedules/:id", scheduleController.getScheduleById);

// Theater routes (public)
router.get("/theaters", theaterController.getAllTheaters);
router.get("/theaters/:id", theaterController.getTheaterById);
router.get("/theaters/city/:city", theaterController.getTheatersByCity);

// Genre routes (public)
router.get("/genres", genreController.getAllGenres);
router.get("/genres/:id", genreController.getGenreById);

// Review routes (public - read only)
router.get("/reviews/movie/:movieId", reviewController.getReviewsByMovie);

// Product routes (public)
router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);

// Voucher routes (public - verify only)
router.post("/vouchers/verify", voucherController.verifyVoucher);

// ============================================
// PROTECTED ROUTES (Cần authentication)
// ============================================

// User routes (Customer)
router.get("/auth/me", authenticateToken, authController.getCurrentUser);
router.put("/auth/change-password", authenticateToken, authController.changePassword);
router.put("/users/profile", authenticateToken, userController.updateProfile);
router.get("/users/loyalty-points", authenticateToken, userController.getLoyaltyPoints);

router.post("/bookings", authenticateToken, bookingController.createBooking);
router.get("/bookings/my-bookings", authenticateToken, bookingController.getMyBookings);
router.get("/bookings/:id", authenticateToken, bookingController.getBookingById);
router.post("/bookings/:id/confirm-payment", authenticateToken, bookingController.confirmPayment);
router.post("/bookings/:id/cancel", authenticateToken, bookingController.cancelBooking);

// Review routes (Customer - write)
router.post("/reviews", authenticateToken, reviewController.createReview);
router.put("/reviews/:id", authenticateToken, reviewController.updateReview);
router.delete("/reviews/:id", authenticateToken, reviewController.deleteReview);

// ============================================
// ADMIN ROUTES
// ============================================

// Movie management (Admin)
router.post("/admin/movies", authenticateToken, authorize("admin", "super-admin"), movieController.createMovie);
router.put("/admin/movies/:id", authenticateToken, authorize("admin", "super-admin"), movieController.updateMovie);
router.delete("/admin/movies/:id", authenticateToken, authorize("admin", "super-admin"), movieController.deleteMovie);

// Schedule management (Admin)
router.post(
  "/admin/schedules",
  authenticateToken,
  authorize("admin", "super-admin"),
  scheduleController.createSchedule
);
router.put(
  "/admin/schedules/:id",
  authenticateToken,
  authorize("admin", "super-admin"),
  scheduleController.updateSchedule
);
router.post(
  "/admin/schedules/:id/cancel",
  authenticateToken,
  authorize("admin", "super-admin"),
  scheduleController.cancelSchedule
);
router.delete(
  "/admin/schedules/:id",
  authenticateToken,
  authorize("admin", "super-admin"),
  scheduleController.deleteSchedule
);

// Theater management (Admin)
router.post("/admin/theaters", authenticateToken, authorize("admin", "super-admin"), theaterController.createTheater);
router.put(
  "/admin/theaters/:id",
  authenticateToken,
  authorize("admin", "super-admin"),
  theaterController.updateTheater
);
router.delete(
  "/admin/theaters/:id",
  authenticateToken,
  authorize("admin", "super-admin"),
  theaterController.deleteTheater
);

// Room management (Admin)
router.post(
  "/admin/theaters/:theaterId/rooms",
  authenticateToken,
  authorize("admin", "super-admin"),
  theaterController.addRoom
);
router.put(
  "/admin/theaters/:theaterId/rooms/:roomId",
  authenticateToken,
  authorize("admin", "super-admin"),
  theaterController.updateRoom
);
router.delete(
  "/admin/theaters/:theaterId/rooms/:roomId",
  authenticateToken,
  authorize("admin", "super-admin"),
  theaterController.deleteRoom
);

// Genre management (Admin)
router.post("/admin/genres", authenticateToken, authorize("admin", "super-admin"), genreController.createGenre);
router.put("/admin/genres/:id", authenticateToken, authorize("admin", "super-admin"), genreController.updateGenre);
router.delete("/admin/genres/:id", authenticateToken, authorize("admin", "super-admin"), genreController.deleteGenre);

// Review management (Admin)
router.get("/admin/reviews", authenticateToken, authorize("admin", "super-admin"), reviewController.getAllReviews);
router.put(
  "/admin/reviews/:id/approve",
  authenticateToken,
  authorize("admin", "super-admin"),
  reviewController.approveReview
);
router.put(
  "/admin/reviews/:id/reject",
  authenticateToken,
  authorize("admin", "super-admin"),
  reviewController.rejectReview
);
router.delete(
  "/admin/reviews/:id",
  authenticateToken,
  authorize("admin", "super-admin"),
  reviewController.deleteReviewByAdmin
);

// User management (Admin)
router.get("/admin/users", authenticateToken, authorize("admin", "super-admin"), userController.getAllUsers);
router.get("/admin/users/:id", authenticateToken, authorize("admin", "super-admin"), userController.getUserById);
router.put("/admin/users/:id/role", authenticateToken, authorize("super-admin"), userController.updateUserRole);
router.delete("/admin/users/:id", authenticateToken, authorize("super-admin"), userController.deleteUser);

// Booking management (Admin)
router.get("/admin/bookings", authenticateToken, authorize("admin", "super-admin"), bookingController.getAllBookings);
router.post(
  "/admin/bookings/check-in",
  authenticateToken,
  authorize("admin", "super-admin"),
  bookingController.checkIn
);

// Product management (Admin)
router.post("/admin/products", authenticateToken, authorize("admin", "super-admin"), productController.createProduct);
router.put(
  "/admin/products/:id",
  authenticateToken,
  authorize("admin", "super-admin"),
  productController.updateProduct
);
router.delete(
  "/admin/products/:id",
  authenticateToken,
  authorize("admin", "super-admin"),
  productController.deleteProduct
);

// Voucher management (Admin)
router.get("/admin/vouchers", authenticateToken, authorize("admin", "super-admin"), voucherController.getAllVouchers);
router.post("/admin/vouchers", authenticateToken, authorize("admin", "super-admin"), voucherController.createVoucher);
router.put(
  "/admin/vouchers/:id",
  authenticateToken,
  authorize("admin", "super-admin"),
  voucherController.updateVoucher
);
router.delete(
  "/admin/vouchers/:id",
  authenticateToken,
  authorize("admin", "super-admin"),
  voucherController.deleteVoucher
);

// Statistics & Reports (Admin)
router.get(
  "/admin/statistics/overview",
  authenticateToken,
  authorize("admin", "super-admin"),
  statisticsController.getOverview
);
router.get(
  "/admin/statistics/revenue",
  authenticateToken,
  authorize("admin", "super-admin"),
  statisticsController.getRevenue
);
router.get(
  "/admin/statistics/movies",
  authenticateToken,
  authorize("admin", "super-admin"),
  statisticsController.getMovieStats
);

// ============================================
// PAYMENT ROUTES
// ============================================

// VNPay
router.post("/bookings/:bookingId/payment/vnpay", authenticateToken, paymentController.createVNPayPayment);
router.get("/payment/vnpay-return", paymentController.handleVNPayReturn);
router.get("/payment/vnpay-ipn", paymentController.handleVNPayIPN);

// MoMo
router.post("/bookings/:bookingId/payment/momo", authenticateToken, paymentController.createMoMoPayment);
router.get("/payment/momo-return", paymentController.handleMoMoReturn);
router.post("/payment/momo-notify", paymentController.handleMoMoNotify);

// Payment utilities
router.get("/bookings/:bookingId/payment/status", authenticateToken, paymentController.queryPaymentStatus);
router.post(
  "/bookings/:bookingId/payment/refund",
  authenticateToken,
  authorize("admin", "super-admin"),
  paymentController.refundPayment
);

// ============================================
// UPLOAD ROUTES
// ============================================

// Movie poster
router.post(
  "/admin/movies/:movieId/upload-poster",
  authenticateToken,
  authorize("admin", "super-admin"),
  uploadMiddleware.single("poster"),
  uploadController.uploadMoviePoster
);

// User avatar
router.post(
  "/users/upload-avatar",
  authenticateToken,
  uploadMiddleware.single("avatar"),
  uploadController.uploadAvatar
);

// Product image
router.post(
  "/admin/products/:productId/upload-image",
  authenticateToken,
  authorize("admin", "super-admin"),
  uploadMiddleware.single("image"),
  uploadController.uploadProductImage
);

// Banner
router.post(
  "/admin/banners/upload",
  authenticateToken,
  authorize("admin", "super-admin"),
  uploadMiddleware.single("banner"),
  uploadController.uploadBanner
);

router.post(
  "/admin/banners/:bannerId/upload",
  authenticateToken,
  authorize("admin", "super-admin"),
  uploadMiddleware.single("banner"),
  uploadController.uploadBanner
);

// Multiple upload
router.post(
  "/admin/upload/multiple",
  authenticateToken,
  authorize("admin", "super-admin"),
  uploadMiddleware.multiple("images", 10),
  uploadController.uploadMultiple
);

// Delete image
router.delete(
  "/admin/upload/:publicId",
  authenticateToken,
  authorize("admin", "super-admin"),
  uploadController.deleteImage
);

export default router;
