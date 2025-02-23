import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { usePokemon } from "../context/PokemonContext";
import Spinner from "../components/Spinner";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
    const [ pokemons, setPokemons ] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToFavorites } = usePokemon();

    useEffect(()=>{
        fetchPokemons();
    }, []) //solo se ejecuta cuando se monta el componente

    const fetchPokemons = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pokemon`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Error al obtener los pokemons");
            }
            const pokemonData = await response.json();
            if (!pokemonData || !Array.isArray(pokemonData)) {
                throw new Error("Formato de datos inválido");
            }
            setPokemons(pokemonData);
        } catch (error) {
            console.error("Error fetching pokemons:", error);
            // Aquí podrías mostrar un mensaje de error al usuario
        } finally {
            setIsLoading(false);
        }
    };

    if(isLoading){
        return <div className="flex justify-center items-center h-screen"><Spinner/></div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Pokemons disponibles</h1>
            {/**Grid de las tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/**Tarjeta individual de cada Pokemon */}

            {
                pokemons.map(pokemon => ( //lo primero que va dentro del map tiene q tener un key
                    <div key={pokemon.id} className="bg-white shadow-md rounded-md p-4">
                        <div className="relative group">
                            <img src={pokemon.sprites.front_default} alt={pokemon.name} 
                                className="w-32 h-32 mx-auto transform group-hover:scale-110 transition-transform duration-500"/>
                        </div>
                        <h2 className="text-xl font-semibold text-center capitalize mt-2">{pokemon.name}</h2>
                        {/**aqui van los botones */}
                        <div className="flex justify-center space-x-2 mt-4">
                            <button className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                            onClick={()=>addToFavorites(pokemon)} //aqui llamare a la funcion del contexto para añadir a favs
                            >
                            Añadir a favoritos</button>
                      
                            <Link 
                                to={`/search/${pokemon.name}`} 
                                className="bg-cyan-400 text-white px-4 py-2 rounded hover:bg-cyan-600"
                            >Ver detalles</Link>
                           
                        </div>
                    </div>
                ))
            }


            </div>
        </div>
    )
}

export default Home