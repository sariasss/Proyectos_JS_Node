import express from "express";
import { getPokemons, getPokemonByValue } from "../controllers/pokemonController.js";

const router = express.Router();

router.get("/", getPokemons);
router.get("/:value", getPokemonByValue);

export default router;
