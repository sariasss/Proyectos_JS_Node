import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
 // Asegúrate de tener el hook useAuth configurado

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const useMovie = () => {
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth();

    // Fetch favorites cuando se monta el componente
    useEffect(() => {
        if (user?.id) {
            fetchFavorites(user.id);
        }
    }, [user]);

    const fetchFavorites = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${VITE_BASE_URL}/favorites/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                credentials: "include"  
            });

            if (!response.ok) {
                throw new Error("Error al obtener los favoritos");
            }

            const data = await response.json();
            setFavorites(data);
        } catch (error) {
            setError(error.message);
            setFavorites([]);
            console.log("Error en fetchFavorites: ", error);
        }
    };

    const addToFavorites = async (movieId, userId) => {
        if (!isAuthenticated) {
            toast.error("Tienes que iniciar sesión", {
                style: {
                    background: "red",
                    color: "white",
                    border: "1px solid black",
                },
                icon: "⚠️",
            });
            return;
        }

        try {
            if (favorites.some(m => m.id === movieId)) {
                toast.error("La película ya está en favoritos", {
                    style: {
                        background: "red",
                        color: "white",
                        border: "1px solid black",
                    },
                    icon: "⚠️",
                });
                return;
            }

            const token = localStorage.getItem("token");
            const response = await fetch(`${VITE_BASE_URL}/favorites/${movieId}/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Error al añadir a favoritos");
            }

            const newFav = await response.json();
            setFavorites(prev => [...prev, newFav]);

            toast.success("Película añadida a favoritos", {
                style: {
                    background: "green",
                    color: "white",
                    border: "1px solid black",
                },
                icon: "⭐",
            });
        } catch (error) {
            setError(error.message);
            console.log("Error en addToFavorites: ", error);
            toast.error("Error al añadir a favoritos", {
                style: {
                    background: "red",
                    color: "white",
                    border: "1px solid black",
                },
                icon: "⚠️",
                position: "bottom-center",
            });
        }
    };

    const removeFromFavorites = async (movieId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${VITE_BASE_URL}/favorites/${movieId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar de favoritos");
            }

            setFavorites(prev => prev.filter(fav => fav.id !== movieId));

            toast.success("Pelicula eliminada de favoritos", {
                style: {
                    background: "green",
                    color: "white",
                    border: "1px solid black",
                },
                icon: "🗑️",
            });
        } catch (error) {
            setError(error.message);
            console.log("Error en removeFromFavorites: ", error);
            toast.error("Error al eliminar de favoritos", {
                style: {
                    background: "red",
                    color: "white",
                    border: "1px solid black",
                },
                icon: "⚠️",
            });
        }
    };

    return {
        favorites,
        error,
        addToFavorites,
        removeFromFavorites,
    };
};
