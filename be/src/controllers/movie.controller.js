import Movie from "../models/movie.model.js";
import Genre from "../models/genre.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const movieController = {
  // Lấy danh sách phim (có phân trang, filter, search)
  getAllMovies: async (req, res) => {
    try {
      const { page = 1, limit = 12, status, genre, search, sortBy = "releaseDate", order = "desc" } = req.query;

      // Build query
      const query = {};

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
      const movieData = req.body;
      movieData.createdBy = req.userId;

      // Validate genres
      if (movieData.genres && movieData.genres.length > 0) {
        const validGenres = await Genre.find({
          _id: { $in: movieData.genres },
        });

        if (validGenres.length !== movieData.genres.length) {
          return errorResponse(res, "Một số thể loại không tồn tại", 400);
        }
      }

      const newMovie = new Movie(movieData);
      await newMovie.save();

      const populatedMovie = await Movie.findById(newMovie._id).populate("genres", "name");

      return successResponse(res, populatedMovie, "Tạo phim thành công", 201);
    } catch (error) {
      console.error("Create movie error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Cập nhật phim (Admin)
  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      updateData.updatedBy = req.userId;

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

      return successResponse(res, populatedMovie, "Tạo phim thành công", 201);
    } catch (error) {
      console.error("Update movie error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  // Xóa phim (Admin)
  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;

      // TODO: Kiểm tra xem phim có lịch chiếu trong tương lai không
      // Nếu có thì không cho xóa hoặc chỉ soft delete

      const deletedMovie = await Movie.findByIdAndDelete(id);

      if (!deletedMovie) {
        return errorResponse(res, "Không tìm thấy phim", 404);
      }

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
        Movie.find({ status: "Đang chiếu" })
          .populate("genres", "name")
          .sort({ releaseDate: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Movie.countDocuments({ status: "Đang chiếu" }),
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
        Movie.find({ status: "Sắp chiếu" })
          .populate("genres", "name")
          .sort({ releaseDate: 1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Movie.countDocuments({ status: "Sắp chiếu" }),
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
        Movie.find({ genres: genreId })
          .populate("genres", "name")
          .sort({ releaseDate: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Movie.countDocuments({ genres: genreId }),
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
