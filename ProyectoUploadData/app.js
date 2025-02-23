// app.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import uploadRoutes from "./routers/uploadRoutes.js"
import recycleRoutes from "./routers/recycleRoutes.js"
import sgMail from '@sendgrid/mail';
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json()); 

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Obtener la ruta absoluta de la carpeta actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta de la carpeta "uploads"
const uploadsDir = path.join(__dirname, "uploads");

// Ruta de la carpeta "recycle"
const recycleDir = path.join(__dirname, "recycle");

// Create both directories if they don't exist
[uploadsDir, recycleDir].forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o777 });
      console.log(`Carpeta "${dir}" creada exitosamente.`);
    } else {
      // Ensure proper permissions on existing directories
      fs.chmodSync(dir, 0o777);
      console.log(`Carpeta "${dir}" ya existe.`);
    }
  } catch (error) {
    console.error(`Error al crear/modificar directorio ${dir}:`, error);
  }
});

// Servir archivos estáticos (como el HTML)
app.use(express.static(path.join(__dirname, "public")));

// Usar las rutas para manejar uploads/files
app.use("/uploads", uploadRoutes);
app.use("/recycle", recycleRoutes);

// Configuramos el puerto donde va a escuchar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


