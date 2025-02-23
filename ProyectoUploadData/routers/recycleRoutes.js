import { Router } from "express";
import { listFiles, deleteFile, emptyRecycleBin } from "../controllers/recycleController.js";

const router = Router();

// Definir rutas correctamente
router.get("/", listFiles);      // GET /recycle  -> Listar archivos
router.delete("/", emptyRecycleBin); // DELETE /recycle -> Vaciar papelera
router.delete("/:fileName", deleteFile); // DELETE /recycle/:fileName -> Eliminar un archivo específico

export default router;
