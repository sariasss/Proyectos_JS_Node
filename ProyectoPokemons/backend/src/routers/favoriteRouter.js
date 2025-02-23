import express from "express";
import { getFavoritos, addFavorito, delFavorito } from "../controllers/favoritosController.js";

const router = express.Router();

router.get("/", getFavoritos);
router.post("/", addFavorito);
router.delete("/:id", delFavorito);

export default router;
