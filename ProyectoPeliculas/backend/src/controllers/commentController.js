import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

export const getComments = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ mensaje: "ID de usuario no válido." });
        }
        const comments = await Comment.find({ user: userId }).lean();
        if (comments.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron comentarios de este usuario." });
        }
        
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener los comentarios" });
    }
};


export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { movieId, userId } = req.params;
        
        const existe = await Comment.findOne({ movie: movieId, user: userId });
        if (existe) {
            return res.status(400).json({ mensaje: "Esta película ya tiene una reseña con este ID" });
        }

        const nuevoComentario = new Comment({ text, movie: movieId, user: userId });
        const savedComment = await nuevoComentario.save();
        
        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al hacer la reseña: ", error });
    }
};

export const delComments = async (req, res) => {
    try {
        const { id } = req.params;
        
        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return res.status(404).json({ mensaje: "Comentario no encontrado" });
        }

        res.status(200).json({ mensaje: "Comentario eliminado correctamente", id });
    } catch (error) {
        console.error("Error al eliminar comentario:", error);
        res.status(500).json({ mensaje: "Error al eliminar el comentario" });
    }
};


export const clearComments = async (req, res) => {
    try {
        await Comment.deleteMany({});
        res.json({ mensaje: "Todas las reseñas han sido eliminadas" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al limpiar las reseñas" });
    }
};
