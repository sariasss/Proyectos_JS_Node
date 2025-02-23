import dotenv from 'dotenv';
import Movie from '../models/Movie.js';

dotenv.config();

const BASE_URL = `${process.env.MOVIE_API_URL}?api_key=${process.env.API_KEY}&language=es-ES`;

export const getVideo = async (id) => {
    try {
        const response = await fetch(`${process.env.MOVIEDATA_API_URL}/${id}/videos?api_key=${process.env.API_KEY}&language=es-ES`);
        if (!response.ok) {
            throw new Error("Error al obtener los trailers de la api moviedb");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener el trailer: ", error);
        return null;
    }
}

export const getData = async (id) => {
    try {
        const response = await fetch(`${process.env.MOVIEDATA_API_URL}/${id}?api_key=${process.env.API_KEY}&language=es-ES`);
        if (!response.ok) {
            throw new Error("Error al obtener los datos de la api moviedb");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener los datos: ", error);
        return null;
    }
}

export const getMovies = async (req, res) => {
    try {
        let { page = 1 } = req.query;
        page = parseInt(page);

        // Check if database is empty and load initial movies
        const movieCount = await Movie.countDocuments();
        if (movieCount === 0) {
            const pagesToFetch = 25; // 25 pages * 20 movies = 500 movies
            let allMovies = [];

            for (let i = 1; i <= pagesToFetch; i++) {
                console.log(`Carga inicial: página ${i} de ${pagesToFetch}...`);
                const response = await fetch(`${BASE_URL}&page=${i}`);
                if (!response.ok) throw new Error(`Error al obtener la página ${i}`);
                const data = await response.json();
                if (data.results) {
                    const movieDetails = await processMovies(data.results);
                    allMovies.push(...movieDetails);
                }
            }

            // Insert movies with upsert to avoid duplicates
            for (const movie of allMovies) {
                await Movie.findOneAndUpdate(
                    { id: movie.id },
                    movie,
                    { upsert: true, new: true }
                );
            }
            console.log(`Carga inicial completada: ${allMovies.length} películas guardadas`);
        }

        // Regular pagination from database
        const moviesPerPage = 20;
        const skip = (page - 1) * moviesPerPage;
        
        const [movies, totalMovies] = await Promise.all([
            Movie.find()
                .sort({ popularity: -1 })
                .skip(skip)
                .limit(moviesPerPage),
            Movie.countDocuments()
        ]);

        return res.status(200).json({
            page,
            totalPages: Math.ceil(totalMovies / moviesPerPage),
            totalResults: totalMovies,
            movies
        });

    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ 
            message: "Error al obtener las películas", 
            error: error.message
        });
    }
};

// Función para procesar los detalles de las películas
const processMovies = async (movies) => {
    return Promise.all(movies.map(async movie => {
        let trailerKey = null;
        let time = null;
        let genres = [];

        const videoData = await getVideo(movie.id);
        const data = await getData(movie.id);

        if (videoData) {
            const trailer = videoData.results.find(video => video.type === "Trailer");
            if (trailer) trailerKey = trailer.key;
        }

        if (data) {
            time = data.runtime;
            genres = data.genres ? data.genres.map(genre => genre.name) : [];
        }

        return {
            id: movie.id,
            title: movie.title || 'Sin título',
            original_title: movie.original_title || '',
            original_language: movie.original_language || '',
            overview: movie.overview || 'Sin descripción disponible',
            genre_ids: movie.genre_ids || [],
            genres: genres,
            release_date: movie.release_date || null,
            popularity: movie.popularity || 0,
            vote_average: movie.vote_average || 0,
            vote_count: movie.vote_count || 0,
            adult: movie.adult || false,
            video: movie.video || false,
            backdrop_path: movie.backdrop_path || null,
            poster_path: movie.poster_path || null,
            trailer_key: trailerKey,
            runtime: time
        };
    }));
};


export const getMovieByValue = async (req, res) => {
    try {
        const { value } = req.params; // Puede ser un ID o un nombre

        let query = {};
        if (!isNaN(value)) {
            query.id = parseInt(value); 
        } else {
            query.title = { $regex: new RegExp(value, "i") }; // Si es texto, buscar por título (insensible a mayúsculas/minúsculas)
        }

        const movie = await Movie.findOne(query);

        if (!movie) {
            console.log(`No se encontró película con valor: ${value}`);
            return res.status(404).json({ 
                mensaje: `Película con valor '${value}' no encontrada` 
            });
        }

        res.json(movie);
    } catch (error) {
        console.error("Error en getMovieByValue:", error);
        res.status(500).json({ 
            mensaje: "Error al obtener la película", 
            error: error.message 
        });
    }
};

export const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();

        if (!movies || movies.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron películas en la base de datos" });
        }

        res.json(movies);
    } catch (error) {
        console.error("Error al obtener todas las películas:", error);
        res.status(500).json({ mensaje: "Error al obtener las películas", error: error.message });
    }
};

