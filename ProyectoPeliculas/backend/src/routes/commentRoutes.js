import express from "express";
import { addComment, delComments, getComments } from "../controllers/commentController.js";
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/:userId", getComments);
router.post("/:movieId/:userId", authMiddleware, addComment);
router.delete("/:id", delComments);

export default router;
