import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
 // Asegúrate de tener el hook useAuth configurado

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

export const useMovie = () => {
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth();

    // Fetch comments cuando se monta el componente
    useEffect(() => {
        if (user?.id) {
            fetchComments(user.id);
        }
    }, [user]);

    const fetchComments = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${VITE_BASE_URL}/comments/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                credentials: "include"  
            });

            if (!response.ok) {
                throw new Error("Error al obtener los reseñas");
            }

            const data = await response.json();
            setComments(data);
        } catch (error) {
            setError(error.message);
            setComments([]);
            console.log("Error en fetchComments: ", error);
        }
    };

    const addToComments = async (movieId, userId) => {
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
            if (comments.some(m => m.id === movieId)) {
                toast.error("La película ya está en reseñas", {
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
            const response = await fetch(`${VITE_BASE_URL}/comments/${movieId}/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Error al añadir a reseñas");
            }

            const newFav = await response.json();
            setComments(prev => [...prev, newFav]);

            toast.success("Película añadida a reseñas", {
                style: {
                    background: "green",
                    color: "white",
                    border: "1px solid black",
                },
                icon: "⭐",
            });
        } catch (error) {
            setError(error.message);
            console.log("Error en addToComments: ", error);
            toast.error("Error al añadir a reseñas", {
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

    const removeFromComments = async (movieId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${VITE_BASE_URL}/comments/${movieId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar de reseñas");
            }

            setComments(prev => prev.filter(fav => fav.id !== movieId));

            toast.success("Pelicula eliminada de reseñas", {
                style: {
                    background: "green",
                    color: "white",
                    border: "1px solid black",
                },
                icon: "🗑️",
            });
        } catch (error) {
            setError(error.message);
            console.log("Error en removeFromComments: ", error);
            toast.error("Error al eliminar de reseñas", {
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
        comments,
        error,
        addToComments,
        removeFromComments,
    };
};
