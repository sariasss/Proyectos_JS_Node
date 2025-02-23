import Favorite from '../models/Favorite.js';
import mongoose from 'mongoose';

export const getFavoritos = async (req, res) => {
    const { userId } = req.params; // Obtener el id del usuario desde los parámetros

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ mensaje: "ID de usuario no válido." });
        }
        const favoritos = await Favorite.find({ userId }).lean();
        
        res.status(200).json(favoritos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener los favoritos" });
    }
};


export const addFavorito = async (req, res) => {
    try {
        const { movieId, userId }  = req.params;
        
        const existe = await Favorite.findOne({ movieId, userId });
        
        if (existe) {
            return res.status(400).json({ mensaje: "Esta película ya está en favoritos" });
        }

        const nuevoFavorito = new Favorite({ movieId, userId });
        const savedFavorite = await nuevoFavorito.save();
        
        res.status(201).json(savedFavorite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al añadir a favoritos" });
    }
};


export const delFavorito = async (req, res) => {
    try {
        const { userId } = req.params;

        const favorito = await Favorite.findByIdAndDelete(userId);

        if (!favorito) {
            return res.status(404).json({ mensaje: "Favorito no encontrado" });
        }

        res.status(200).json({ mensaje: "Favorito eliminado correctamente", userId });
    } catch (error) {
        console.error("Error al eliminar favorito:", error);
        res.status(500).json({ mensaje: "Error al eliminar el favorito" });
    }
};


export const clearFavoritos = async (req, res) => {
    try {
        await Favorite.deleteMany({});
        res.json({ mensaje: "Todos los favoritos han sido eliminados" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al limpiar favoritos" });
    }
};
