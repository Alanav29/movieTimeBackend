const express = require("express");
const router = express.Router();
const {
	getMovies,
	getMovie,
	setMovie,
	updateMovie,
	deleteMovie,
} = require("../controllers/moviesControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getMovies).post(protect, setMovie);

router
	.route("/:id")
	.delete(protect, deleteMovie)
	.put(protect, updateMovie)
	.get(getMovie);

module.exports = router;
