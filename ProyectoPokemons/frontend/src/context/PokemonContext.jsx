import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const PokemonContext = createContext();
const VITE_API_URL = import.meta.env.VITE_API_URL;

export function PokemonProvider({ children }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await fetch(`${VITE_API_URL}/favorite`);
            if (!response.ok) {
                throw new Error("Error al obtener favoritos");
            }
            const data = await response.json();
            setFavorites(data);
        } catch (error) {
            console.error("Error fetching favorites: ", error);
            setFavorites([]);
        }
    };

    const addToFavorites = async (pokemon) => {
        try {
            if (favorites.some(f => f.pokemonId === pokemon.id)) {
                toast.error("El pokemon ya está en favoritos", {
                    style: {
                        background: 'red',
                        color: 'white',
                        border: "1px solid black",
                    },
                    icon: '⭐',
                });
                return;
            }

            const response = await fetch(`${VITE_API_URL}/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pokemonId: pokemon.id,
                    pokemon: pokemon
                }),
            });

            if (!response.ok) {
                throw new Error("Error al añadir a favoritos");
            }

            const newFavorite = await response.json();
            setFavorites(prev => [...prev, newFavorite]);
            
            toast.success("Pokemon añadido a favoritos", {
                style: {
                    background: 'green',
                    color: 'white',
                    border: "1px solid black",
                },
                icon: '⭐',
            });
        } catch (error) {
            console.error('Error adding favorite:', error);
            toast.error("Error al añadir a favoritos", {
                style: {
                    background: 'red',
                    color: 'white',
                    border: "1px solid black",
                },
                icon: '⚠️',
            });
        }
    };

    const removeFromFavorites = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/favorite/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.mensaje || "Error al eliminar de favoritos");
            }

            setFavorites(prev => prev.filter(fav => fav._id !== id));
            
            toast.success("Pokemon eliminado de favoritos", {
                style: {
                    background: 'green',
                    color: 'white',
                    border: "1px solid black",
                },
                icon: '🗑️',
            });
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast.error("Error al eliminar de favoritos", {
                style: {
                    background: 'red',
                    color: 'white',
                    border: "1px solid black",
                },
                icon: '⚠️',
            });
        }
    };

    return (
        <PokemonContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
            {children}
        </PokemonContext.Provider>
    );
}

// Hook personalizado para usar el contexto
export const usePokemon = () => {
    const context = useContext(PokemonContext);
    if (!context) {
        throw new Error("usePokemon debe ser usado dentro de un PokemonProvider");
    }
    return context;
};
