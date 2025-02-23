import { useState, useEffect } from "react";
import { getRecentMovies, getPopular10Movies, getTopRatedMovies } from "../services/tmdb";
import { Link } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";
import { BeatLoader } from "react-spinners";

const MovieList = () => {
  const [movies, setMovies] = useState({
    popular: [],
    topRated: [],
    recent: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const [popularMovies, recentMovies, topRatedMovies] = await Promise.all([
          getPopular10Movies(),  
          getRecentMovies(),
          getTopRatedMovies()
        ]);

        setMovies({
          popular: popularMovies, 
          recent: recentMovies,
          topRated: topRatedMovies
        });
      } catch (error) {
        setError(error);
        console.error("Error al obtener las películas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);
  // Si hay error, mostramos un mensaje
  if (error) {
    return (
      <div className="text-center p-10">
        <h2 className="text-red-600 font-bold text-2xl">Error al traer las películas</h2>
        <p className="text-xl font-medium">{error.message}</p>
        <Link to="/" className="text-blue-600">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-sky-950">Catálogo de Películas</h1>
      </header>
      
      {/* Top Rated Movies Section */}
      <section>
        <h2 className="text-2xl font-bold text-sky-950 mb-7">
          Películas Mejor Valoradas
        </h2>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <BeatLoader color="#052F4A" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.topRated.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
      {/* Sección de películas recientes */}
      <section>
        <h2 className="text-2xl font-bold text-sky-950 mb-7">
          Novedades - Últimas Películas
        </h2>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <BeatLoader color="#052F4A" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.recent.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Sección de películas populares */}
      <section>
        <h2 className="text-2xl font-bold text-sky-950 mb-7">
          Películas Más Populares
        </h2>
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <BeatLoader color="#052F4A" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.popular.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieList;
