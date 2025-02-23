import express from "express";
import { addFavorito, delFavorito, getFavoritos } from "../controllers/favoriteController.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/:userId", authMiddleware, getFavoritos);
router.post("/:movieId/:userId", authMiddleware, addFavorito);
router.delete("/:userId", authMiddleware, delFavorito);

export default router;
