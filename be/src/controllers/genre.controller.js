import Genre from "../models/genre.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

const genreController = {
  getAllGenres: async (req, res) => {
    try {
      const genres = await Genre.find().sort({ name: 1 }).lean();

      return successResponse(res, genres);
    } catch (error) {
      console.error("Get all genres error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  getGenreById: async (req, res) => {
    try {
      const { id } = req.params;

      const genre = await Genre.findById(id).lean();
      if (!genre) {
        return errorResponse(res, "Không tìm thấy thể loại", 404);
      }

      return successResponse(res, genre);
    } catch (error) {
      console.error("Get genre by id error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  createGenre: async (req, res) => {
    try {
      const genreData = req.body;

      const newGenre = new Genre(genreData);
      await newGenre.save();

      return successResponse(res, newGenre, "Tạo thể loại thành công", 201);
    } catch (error) {
      console.error("Create genre error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  updateGenre: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const genre = await Genre.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!genre) {
        return errorResponse(res, "Không tìm thấy thể loại", 404);
      }

      return successResponse(res, genre, "Cập nhật thể loại thành công");
    } catch (error) {
      console.error("Update genre error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },

  deleteGenre: async (req, res) => {
    try {
      const { id } = req.params;

      const genre = await Genre.findByIdAndDelete(id);
      if (!genre) {
        return errorResponse(res, "Không tìm thấy thể loại", 404);
      }

      return successResponse(res, {}, "Xóa thể loại thành công");
    } catch (error) {
      console.error("Delete genre error:", error);
      return errorResponse(res, "Lỗi server", 500);
    }
  },
};

export default genreController;
