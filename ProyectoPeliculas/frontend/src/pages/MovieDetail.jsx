import { useParams } from "react-router-dom";
import { useFetch } from "../hook/useFetch";
import { getImageUrl, getMovieDetails } from "../services/tmdb";
import { BeatLoader } from "react-spinners";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const MovieDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const { data: movie, loading, error } = useFetch(() => getMovieDetails(id), [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Debes iniciar sesión para comentar", {
        style: { background: "red", color: "white", border: "1px solid black" },
        icon: "⚠️",
      });
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/comments/${id}/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ text: comment }),
      });

      if (!response.ok) {
        throw new Error("Error al publicar el comentario");
      }

      toast.success("Comentario publicado con éxito", {
        style: {
            background: "green",
            color: "white",
            border: "1px solid black",
        },
        icon: "⭐",
    });
      setComment("");
    } catch (error) {
      toast.error("Error al publicar el comentario", {
        style: { background: "red", color: "white", border: "1px solid black" },
        icon: "⚠️",
      });
      console.error("Error:", error);
    }
  };

  if (error) {
    return (
      <div className="text-center p-10">
        <p className="text-red-800">Error al cargar la película</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
          <BeatLoader color="#052F4A" />
      </div>
  );
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Backdrop image */}
      <header className="relative h-96 mb-8">
        <img 
          src={getImageUrl(movie?.backdrop_path, "original")} 
          alt={movie?.title} 
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
          <div className="absolute bottom-0 text-white p-6">
            <h1 className="text-4xl font-bold">{movie?.title}</h1>
            <p className="text-lg">{movie?.runtime} min - {movie?.release_date?.split("-")[0]}</p>
            <p>{movie?.vote_average}⭐</p>
          </div>
        </div>
      </header>

      {/* Poster and details */}
      <div className="flex mb-8">
        {/* Poster image */}
        <div className="w-1/3 pr-8">
          <img 
            src={getImageUrl(movie?.poster_path, "original")} 
            alt={movie?.title} 
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Movie details */}
        <div className="w-2/3">
          {/* Genres */}
          <div className="mb-4">
            {movie?.genres?.map(g => (
              <span key={g} className="inline-block text-gray-900 bg-gray-300 rounded-2xl px-4 py-1 mr-2 mb-2">
                {g}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <h2 className="text-2xl font-bold mb-2">Sinopsis</h2>
          <p>{movie?.overview}</p>

          {/* Trailer */}
          <h2 className="text-2xl font-bold mb-2 mt-6">Trailer</h2>
          <div className="aspect-video">
            {movie?.trailer_key ? (
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${movie.trailer_key}`}
                title="Movie Trailer"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">No hay trailer disponible</p>
              </div>
            )}
          </div>

          {/* Comment Form */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Deja tu comentario</h2>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  rows="4"
                  placeholder="Escribe tu comentario..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-sky-950 text-white px-6 py-2 rounded-lg hover:bg-sky-800 transition-colors"
              >
                Publicar comentario
              </button>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
}

export default MovieDetail;
