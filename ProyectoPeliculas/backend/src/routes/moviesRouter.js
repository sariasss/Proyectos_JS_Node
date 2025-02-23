import express from "express";
import { getAllMovies, getMovieByValue, getMovies } from "../controllers/movieController.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/all", getAllMovies);
router.get("/:value", getMovieByValue);

export default router;
