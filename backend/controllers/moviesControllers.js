const asyncHandler = require("express-async-handler");
const Movie = require("../models/movieModel");

const getMovies = asyncHandler(async (req, res) => {
	const movies = await Movie.find();

	res.status(200).json(movies);
});

const getMovie = asyncHandler(async (req, res) => {
	const movie = await Movie.findById(req.params.id);
	if (!movie) {
		res.status(400);
		throw new Error("La pelicula no fué encontrada");
	}
	res.status(200).json(movie);
});

const setMovie = asyncHandler(async (req, res) => {
	if (!req.body.title) {
		res.status(400);
		throw new Error("Por favor agrega el titulo de la pelicula");
	}

	const searchMovie = await Movie.find({ title: req.body.title });
	const searchedMovie = JSON.stringify(searchMovie);

	if (searchedMovie.length > 2) {
		res.status(400);
		throw new Error("Ya existe una pelicula con ese titulo");
	}

	if (!req.body.overview) {
		res.status(400);
		throw new Error("Por favor agrega la sinopsis  de la pelicula");
	}

	if (!req.body.release_date) {
		res.status(400);
		throw new Error("Por favor agrega la fecha de estreno de la pelicula");
	}

	if (!req.body.poster) {
		res.status(400);
		throw new Error("Por favor agrega la URL del poster de la pelicula");
	}

	const movie = await Movie.create({
		title: req.body.title,
		overview: req.body.overview,
		release_date: req.body.release_date,
		poster: `https://image.tmdb.org/t/p/w500/${req.body.poster}`,
		likes: 0,
	});

	res.status(201).json({ movie });
});

const updateMovie = asyncHandler(async (req, res) => {
	const movie = await Movie.findById(req.params.id);
	if (!movie) {
		res.status(400);
		throw new Error("La pelicula no fué encontrada");
	}

	let movieInfo = {
		title: undefined,
		overview: undefined,
		release_date: undefined,
		poster: undefined,
		likes: undefined,
	};

	if (!req.body.title) {
		movieInfo.title = movie.title;
	} else {
		movieInfo.title = req.body.title;
	}

	if (!req.body.overview) {
		movieInfo.overview = movie.overview;
	} else {
		movieInfo.overview = req.body.overview;
	}

	if (!req.body.release_date) {
		movieInfo.release_date = movie.release_date;
	} else {
		movieInfo.release_date = req.body.release_date;
	}

	if (!req.body.poster) {
		movieInfo.poster = movie.poster;
	} else {
		movieInfo.poster = `https://image.tmdb.org/t/p/w500/${req.body.poster}`;
	}

	if (!req.body.likes) {
		movieInfo.likes = movie.likes;
	} else {
		movieInfo.likes = movie.likes += Number(req.body.likes);
	}

	const movieUpdated = await Movie.findByIdAndUpdate(req.params.id, movieInfo, {
		new: true,
	});

	res.status(200).json(movieUpdated);
});

const deleteMovie = asyncHandler(async (req, res) => {
	const movie = await Movie.findById(req.params.id);
	if (!movie) {
		res.status(400);
		throw new Error("La pelicula no fué encontrada");
	}

	await movie.deleteOne();

	res.status(200).json({ id: req.params.id });
});

module.exports = {
	getMovies,
	getMovie,
	setMovie,
	updateMovie,
	deleteMovie,
};
