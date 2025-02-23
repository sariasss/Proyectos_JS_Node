import { Favorite } from "../models/database.js";

export const getFavoritos = async (req, res) => {
    try {
        const favoritos = await Favorite.find().lean();
        res.status(200).json(favoritos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los favoritos" });
    }
};

export const addFavorito = async (req, res) => {
    try {
        const { pokemonId, pokemon } = req.body;
        
        const existe = await Favorite.findOne({ pokemonId });
        if (existe) {
            return res.status(400).json({ mensaje: "Este Pokémon ya está en favoritos" });
        }

        const favorite = new Favorite({ pokemonId, pokemon });
        const savedFavorite = await favorite.save();
        res.status(201).json(savedFavorite);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al añadir a favoritos" });
    }
};

export const delFavorito = async (req, res) => {
    try {
        const { id } = req.params;
        
        const favorito = await Favorite.findByIdAndDelete(id);
        if (!favorito) {
            return res.status(404).json({ mensaje: "Favorito no encontrado" });
        }

        res.status(200).json({ mensaje: "Favorito eliminado correctamente", id });
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
