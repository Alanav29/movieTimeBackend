const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Por favor escribe el nombre de la pelicula"],
		},
		overview: {
			type: String,
			required: [true, "Por favor escribe la sinopsis de la pelicula"],
		},
		release_date: {
			type: String,
			required: [true, "Por favor escribe la fecha de estreno de la pelicula"],
		},
		poster: {
			type: String,
			required: [true, "Por favor escribe la sinopsis de la pelicula"],
		},
		likes: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Movie", movieSchema);
