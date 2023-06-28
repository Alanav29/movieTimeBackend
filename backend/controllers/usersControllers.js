const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asynchandler = require("express-async-handler");
const User = require("../models/userModel");

const crearUsuario = asynchandler(async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error("Faltan datos");
	}

	const userExists = await User.findOne({ email });
	if (userExists) {
		res.status(400);
		throw new Error("Ese usuario ya existe");
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({
		name,
		email,
		password: hashedPassword,
	});

	if (user) {
		res.status(201).json({
			_id: user.id,
			name: user.name,
			email: user.email,
		});
	} else {
		res.status(400);
		throw new Error("Datos No Validos");
	}
});

const loginUser = asynchandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.status(200).json({
			_id: user.id,
			name: user.name,
			email: user.email,
			likedMovies: user.likedMovies,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Credenciales incorrectas");
	}
});

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

const misDatos = asynchandler(async (req, res) => {
	res.status(200).json(req.user);
});

const updateUser = asynchandler(async (req, res) => {
	const { email, likedMovie } = req.body;

	//buscamos el usuario
	const user = await User.findOne({ email });

	if (user && likedMovie) {
		let userLikedMovies = user.likedMovies;
		userLikedMovies.push(likedMovie);
		let userUpdated = await User.findByIdAndUpdate(
			user._id,
			{
				likedMovies: userLikedMovies,
			},
			{ new: true }
		);

		res.status(200).json(userUpdated);
	} else {
		res.status(404);
		throw new Error("No se encontro el usuario");
	}
});

const updateUserLikedMovies = asynchandler(async (req, res) => {
	const { email, unlikedMovie } = req.body;

	const user = await User.findOne({ email });

	if (user && unlikedMovie) {
		let userLikedMovies = user.likedMovies;
		userLikedMovies.splice(unlikedMovie, 1);
		let userUpdated = await User.findByIdAndUpdate(
			user._id,
			{
				likedMovies: userLikedMovies,
			},
			{ new: true }
		);

		res.status(200).json(userUpdated);
	} else {
		res.status(404);
		throw new Error("No se encontro el usuario");
	}
});

module.exports = {
	crearUsuario,
	loginUser,
	misDatos,
	updateUser,
	updateUserLikedMovies,
};
