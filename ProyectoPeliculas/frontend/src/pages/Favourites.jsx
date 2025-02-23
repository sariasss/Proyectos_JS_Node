

import { useMovie } from "../hook/useFavorite";
import { getImageUrl, getMovieDetails } from "../services/tmdb";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";


const Favourites = () => {
  const { favorites, removeFromFavorites, error } = useMovie();
  const [movieDetails, setMovieDetails] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const details = await Promise.all(
          favorites.map(async (fav) => {
            const data = await getMovieDetails(fav.movieId);
            return { ...data, favoriteId: fav._id };
          })
        );
        setMovieDetails(details);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    if (favorites.length > 0) {
      fetchMovieDetails();
    }
  }, [favorites]);

  if (error) {
    return (
      <div className="text-center p-10">
        <h2 className="text-red-600 font-bold text-2xl">Error loading favorites</h2>
        <p className="text-xl font-medium">{error}</p>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-sky-950">Todavía no tienes peliculas favoritas</h2>
        <p className="text-gray-600 mt-2">¡Descubre peliculas y añadelas a la lista!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-sky-950 mb-8">Mis Peliculas Favoritas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movieDetails.map((movie) => (
          <article key={movie.favoriteId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-auto object-cover"
                />
              </Link>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  await removeFromFavorites(movie.favoriteId);
                  window.location.reload();
                }}
                className="absolute top-2 left-2 bg-black bg-opacity-50 text-white py-1 px-2 rounded"
                title="Remove from favorites"
              >
                ❌
              </button>
            </div>
            <Link to={`/movie/${movie.id}`}>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                <p className="text-gray-600 text-sm">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "Sin valoración"} ⭐
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Favourites;