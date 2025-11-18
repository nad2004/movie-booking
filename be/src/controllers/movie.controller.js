import Movie from "../models/movie.model.js";
import Genre from "../models/genre.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const movieController = {
  // Lấy danh sách phim (có phân trang, filter, search)
  getAllMovies: async (req, res) => {
    try {
      const { page = 1, limit = 12, status, genre, search, sortBy = "releaseDate", order = "desc" } = req.query;

      // Build query
      const query = {
        isDeleted: { $ne: true }, // Exclude deleted movies
      };

      if (status) {
        query.status = status;
      }

      if (genre) {
        query.genres = genre;
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { director: { $regex: search, $options: "i" } },
          { actors: { $regex: search, $options: "i" } },
        ];
      }

      // Build sort
      const sort = {};
      sort[sortBy] = order === "asc" ? 1 : -1;

      // Execute query
      const skip = (page - 1) * limit;
      const [movies, total] = await Promise.all([
        Movie.find(query).populate("genres", "name").sort(sort).skip(skip).limit(parseInt(limit)).lean(),
        Movie.countDocuments(query),
      ]);

      return successResponse(res, {
        movies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get all movies error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy chi tiết một phim
  getMovieById: async (req, res) => {
    try {
      const { id } = req.params;

      const movie = await Movie.findById(id)
        .populate("genres", "name description")
        .populate("createdBy", "fullName email")
        .populate("updatedBy", "fullName email")
        .lean();

      if (!movie) {
        return errorResponse(res, "Không tìm thấy phim", 404);
      }

      return successResponse(res, movie);
    } catch (error) {
      console.error("Get movie by id error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Tạo phim mới (Admin)
  createMovie: async (req, res) => {
    try {
      console.log("Create movie - Body:", req.body);
      const movieData = req.body;
      movieData.createdBy = req.userId;

      // Fix Swagger array issue - convert object to array if needed
      if (movieData.actors && typeof movieData.actors === "object" && !Array.isArray(movieData.actors)) {
        movieData.actors = Object.values(movieData.actors);
      }
      if (movieData.genres && typeof movieData.genres === "object" && !Array.isArray(movieData.genres)) {
        movieData.genres = Object.values(movieData.genres);
      }
      if (movieData.subtitles && typeof movieData.subtitles === "object" && !Array.isArray(movieData.subtitles)) {
        movieData.subtitles = Object.values(movieData.subtitles);
      }

      // Validate genres
      if (movieData.genres && movieData.genres.length > 0) {
        console.log("Validating genres:", movieData.genres);
        const validGenres = await Genre.find({
          _id: { $in: movieData.genres },
        });
        console.log("Valid genres found:", validGenres.length);

        if (validGenres.length !== movieData.genres.length) {
          return errorResponse(res, "Một số thể loại không tồn tại", 400);
        }
      }

      console.log("Creating movie with data:", movieData);
      const newMovie = new Movie(movieData);
      await newMovie.save();

      const populatedMovie = await Movie.findById(newMovie._id).populate("genres", "name");

      return successResponse(res, populatedMovie, "Tạo phim thành công", 201);
    } catch (error) {
      console.error("Create movie error:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      return errorResponse(res, error.message || "Lỗi server", 500);
    }
  },

  // Cập nhật phim (Admin)
  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      updateData.updatedBy = req.userId;

      console.log("Update movie - ID:", id);
      console.log("Update movie - Body:", updateData);

      // Fix Swagger array issue - convert object to array if needed
      if (updateData.actors && typeof updateData.actors === "object" && !Array.isArray(updateData.actors)) {
        updateData.actors = Object.values(updateData.actors);
      }
      if (updateData.genres && typeof updateData.genres === "object" && !Array.isArray(updateData.genres)) {
        updateData.genres = Object.values(updateData.genres);
      }
      if (updateData.subtitles && typeof updateData.subtitles === "object" && !Array.isArray(updateData.subtitles)) {
        updateData.subtitles = Object.values(updateData.subtitles);
      }

      // Extract genre IDs if genres are objects
      if (updateData.genres && Array.isArray(updateData.genres) && updateData.genres.length > 0) {
        if (typeof updateData.genres[0] === "object" && updateData.genres[0]._id) {
          updateData.genres = updateData.genres.map((g) => g._id);
          console.log("Extracted genre IDs:", updateData.genres);
        }
      }

      // Extract actor names if actors are objects
      if (updateData.actors && Array.isArray(updateData.actors) && updateData.actors.length > 0) {
        if (typeof updateData.actors[0] === "object" && updateData.actors[0].name) {
          updateData.actors = updateData.actors.map((a) => a.name);
        }
      }

      // Validate genres nếu có
      if (updateData.genres && updateData.genres.length > 0) {
        const validGenres = await Genre.find({
          _id: { $in: updateData.genres },
        });

        if (validGenres.length !== updateData.genres.length) {
          return errorResponse(res, "Một số thể loại không tồn tại", 400);
        }
      }

      const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(
        "genres",
        "name"
      );

      if (!updatedMovie) {
        return errorResponse(res, "Không tìm thấy phim", 404);
      }

      return successResponse(res, updatedMovie, "Cập nhật phim thành công");
    } catch (error) {
      console.error("Update movie error:", error);
      console.error("Error message:", error.message);
      return errorResponse(res, error.message || "Lỗi server", 500);
    }
  },

  // Xóa phim (Admin)
  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;

      const movie = await Movie.findById(id);
      if (!movie) {
        return errorResponse(res, "Không tìm thấy phim", 404);
      }

      // ✅ FIX: Kiểm tra xem phim có lịch chiếu trong tương lai không
      const Schedule = (await import("../models/schedule.model.js")).default;
      const now = new Date();
      const futureSchedules = await Schedule.countDocuments({
        movie: id,
        showDate: { $gte: now },
        status: { $ne: "Đã hủy" },
      });

      if (futureSchedules > 0) {
        return errorResponse(
          res,
          `Không thể xóa phim. Phim còn ${futureSchedules} suất chiếu trong tương lai. Vui lòng hủy tất cả lịch chiếu trước khi xóa phim.`,
          400
        );
      }

      // ✅ FIX: Soft delete thay vì hard delete để giữ lại dữ liệu lịch sử
      movie.isDeleted = true;
      movie.status = "Ngừng chiếu";
      movie.updatedBy = req.userId;
      await movie.save();

      // Xóa cache
      const redisService = (await import("../services/redis.service.js")).default;
      redisService.invalidateMovieCache(id.toString()).catch(() => {});

      return successResponse(res, {}, "Xóa phim thành công");
    } catch (error) {
      console.error("Delete movie error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy phim đang chiếu
  getNowShowingMovies: async (req, res) => {
    try {
      const { page = 1, limit = 12 } = req.query;
      const skip = (page - 1) * limit;

      const [movies, total] = await Promise.all([
        Movie.find({ status: "Đang chiếu", isDeleted: { $ne: true } })
          .populate("genres", "name")
          .sort({ releaseDate: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Movie.countDocuments({ status: "Đang chiếu", isDeleted: { $ne: true } }),
      ]);

      return successResponse(res, {
        movies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    } catch (error) {
      console.error("Get now showing movies error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy phim sắp chiếu
  getUpcomingMovies: async (req, res) => {
    try {
      const { page = 1, limit = 12 } = req.query;
      const skip = (page - 1) * limit;

      const [movies, total] = await Promise.all([
        Movie.find({ status: "Sắp chiếu", isDeleted: { $ne: true } })
          .populate("genres", "name")
          .sort({ releaseDate: 1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Movie.countDocuments({ status: "Sắp chiếu", isDeleted: { $ne: true } }),
      ]);

      return successResponse(res, {
        movies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    } catch (error) {
      console.error("Get upcoming movies error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Lấy phim theo thể loại
  getMoviesByGenre: async (req, res) => {
    try {
      const { genreId } = req.params;
      const { page = 1, limit = 12 } = req.query;
      const skip = (page - 1) * limit;

      // Kiểm tra genre tồn tại
      const genre = await Genre.findById(genreId);
      if (!genre) {
        return errorResponse(res, "Không tìm thấy thể loại", 404);
      }

      const [movies, total] = await Promise.all([
        Movie.find({ genres: genreId, isDeleted: { $ne: true } })
          .populate("genres", "name")
          .sort({ releaseDate: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Movie.countDocuments({ genres: genreId, isDeleted: { $ne: true } }),
      ]);

      return successResponse(res, {
        genre: genre.name,
        movies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        },
      });
    } catch (error) {
      console.error("Get movies by genre error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default movieController;
