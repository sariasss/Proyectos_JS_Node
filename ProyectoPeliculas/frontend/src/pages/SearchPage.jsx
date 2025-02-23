

import { useState } from "react";
import { MovieCard } from "../components/MovieCard";
import { searchMovies } from "../services/tmdb";
import { BeatLoader } from "react-spinners";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchMovies(searchTerm);
      setMovies(data.movies || []);
    } catch (error) {
      setError("Error al buscar películas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4 max-w-2xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar películas..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="bg-sky-900 text-white px-6 py-2 rounded-lg hover:bg-sky-950 transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex justify-center my-8">
          <BeatLoader color="#0EA5E9" />
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 my-8">
          <p>{error}</p>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="text-center mb-4">
          <p className="text-gray-600">
            Se encontraron {movies.length} películas
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;