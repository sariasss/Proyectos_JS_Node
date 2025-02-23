
import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdb";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useMovie } from "../hook/useFavorite";

export const MovieCard = ({ movie }) => {
  const { user} = useAuth();
  const { addToFavorites } = useMovie();
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  return (
    <Link to={`/movie/${movie.id}`} className="bg-gray-200 rounded rounded-md"> {/*hacer */}
      <article className="card transform transition-transform duration-300 hover:scale-105">
        <div className="relative aspect-[2/3]">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white py-1  px-2 rounded">
            ⭐ {rating}
          </div>
          <button
            className="absolute top-2 left-2 bg-black bg-opacity-50 text-white py-1 px-2 rounded"
            onClick={() => {
              if (user?.id) {
                addToFavorites(movie.id, user.id);
              } else {
                toast.error("Debes iniciar sesión para añadir a favoritos", {
                  style: { background: "red", color: "white", border: "1px solid black" },
                  icon: "⚠️",
                });
              }
            }}
          >
            🤍
          </button>


        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 text-black">{movie.title}</h3>
          <p className="text-sm text-gray-800 line-clamp-2" >
            {movie.release_date}
          </p>
        </div>
      </article>
    </Link>
  );
};
