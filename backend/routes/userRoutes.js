const express = require("express");
const router = express.Router();
const {
	crearUsuario,
	loginUser,
	misDatos,
	updateUser,
	updateUserLikedMovies,
} = require("../controllers/usersControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(crearUsuario).put(protect, updateUserLikedMovies);
router.route("/likedMovies").put(protect, updateUser);
router.post("/login", loginUser);
router.get("/me", protect, misDatos);

module.exports = router;
