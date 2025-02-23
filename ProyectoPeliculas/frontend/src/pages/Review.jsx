import { useEffect, useState } from "react";
import { useMovie } from "../hook/useComment";
import { getImageUrl, getMovieDetails } from "../services/tmdb";
import { Link } from "react-router-dom";

const Review = () => {
  const { comments, error, removeFromComments } = useMovie();
  const [movieDetails, setMovieDetails] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const details = await Promise.all(
          comments.map(async (comment) => {
            const data = await getMovieDetails(comment.movie);
            return { 
              ...data, 
              commentId: comment._id, 
              commentText: comment.text
            };
          })
        );
        setMovieDetails(details);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    if (comments.length > 0) {
      fetchMovieDetails();
    }
  }, [comments]);

  const handleRemoveComment = async (commentId) => {
    try {
      await removeFromComments(commentId);
      setMovieDetails(prevDetails => prevDetails.filter(movie => movie.commentId !== commentId));
    } catch (error) {
      console.error("Error removing comment:", error);
    }
  };

  if (error) {
    return (
      <div className="text-center p-10">
        <h2 className="text-red-600 font-bold text-2xl">Error loading reviews</h2>
        <p className="text-xl font-medium">{error}</p>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold text-sky-950">Todavía no tienes reseñas</h2>
        <p className="text-gray-600 mt-2">¡Comenta las películas que has visto!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-sky-950 mb-8">Mis Reseñas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movieDetails.map((movie) => (
          <article key={movie.commentId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <Link to={`/movie/${movie.id}`}>
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-auto object-cover"
                />
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveComment(movie.commentId);
                }}
                className="absolute top-2 left-2 bg-black bg-opacity-50 text-white py-1 px-2 rounded"
                title="Eliminar reseña"
              >
                ❌
              </button>
            </div>
            <div className="p-4">
              <Link to={`/movie/${movie.id}`}>
                <h3 className="font-bold text-lg mb-2 hover:text-sky-700 transition-colors line-clamp-1">
                  {movie.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-sky-100 text-sky-800 px-2 py-1 rounded-full text-xs font-medium">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"} ⭐
                </span>
              </div>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-sky-100 transition-colors">
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "{movie.commentText}"
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Review;
