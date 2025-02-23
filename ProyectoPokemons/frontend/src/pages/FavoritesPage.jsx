import { Link } from "react-router-dom";
import { usePokemon } from "../context/PokemonContext"
import {ROUTES} from "../routes/paths"
const FavoritesPage = () => {
  const {favorites, removeFromFavorites} = usePokemon();

  if(favorites.length === 0){
    return(
      <div className="text-center mt-8">
        <h1 className="text-3xl font-bold mb-4">Favoritos</h1>
        <p>No tienes pokemons en favoritos actualmente</p>
        <Link to={ROUTES.HOME} className="text-blue-800 hover:underline block mt-4">Volver a la pagina de inicio</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tus pokemons favoritos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map(favorite => (
          <div key={favorite._id} className="bg-amber-50 rounded-lg p-4 shadow-amber-100 shadow-lg">
            <img 
              src={favorite.pokemon.sprites.other.dream_world.front_default} 
              alt={favorite.pokemon.name} 
              className="w-32 h-32 mx-auto"
            />
            <h2 className="text-xl font-semibold text-center capitalize mt-2">
              {favorite.pokemon.name}
            </h2>
            <div className="mt-4 space-y-2">
              <Link 
                to={`${ROUTES.SEARCH}/${favorite.pokemon.name}`}
                className="block w-full text-center bg-cyan-400 text-white px-4 py-2 rounded hover:bg-cyan-500"
              >
                Ver detalles
              </Link>
              <button 
                onClick={() => removeFromFavorites(favorite._id)}
                className="w-full text-center bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-700"
              >
                Eliminar Favorito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoritesPage