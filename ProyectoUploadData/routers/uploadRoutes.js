import { Router } from "express";
import {
  upload,
  uploadFile,
  listFiles,
  deleteFile,
  getFolderSize,
  sendSummaryEmail,
} from "../controllers/uploadController.js";

const router = Router();

router.post("/", upload.single("file"), uploadFile);
router.get("/", listFiles);
router.get("/size", getFolderSize);
router.delete("/:fileName", deleteFile);
router.post("/send-summary", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Se requiere un correo electrónico" });
  }

  try {
    await sendSummaryEmail(email);
    res.json({ message: "Resumen enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
});

export default router;