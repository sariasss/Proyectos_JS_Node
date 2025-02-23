// controllers/recycleController.js
import fs from "fs";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta donde se guardarán los archivos subidos
    cb(null, path.join(process.cwd(), "recycle"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export const listFiles = (req, res) => {
    const recycleDir = path.join(process.cwd(), "recycle"); // Asegura la ruta correcta
  
    if (!fs.existsSync(recycleDir)) {
      return res.status(404).json({ error: "La carpeta recycle no existe" });
    }
  
    fs.readdir(recycleDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: "Error al listar archivos" });
      }
      res.json(files);
    });
  };

export const deleteFile = (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(process.cwd(), "recycle", fileName);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).send(`Archivo no encontrado: ${fileName}`);
    }

    fs.unlinkSync(filePath);
    res.send(`Archivo ${fileName} eliminado con éxito`);
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).send(`Error al eliminar archivo: ${fileName}`);
  }
};

export const emptyRecycleBin = (req, res) => {
  const recycleDir = path.join(process.cwd(), "recycle");
  
  fs.readdir(recycleDir, (err, files) => {
    if (err) return res.status(500).send("Error al listar archivos en papelera");

    let deletionErrors = [];

    files.forEach((file) => {
      try {
        fs.unlinkSync(path.join(recycleDir, file));
      } catch (error) {
        deletionErrors.push(file);
        console.error(`Error al eliminar ${file}:`, error);
      }
    });

    if (deletionErrors.length > 0) {
      return res.status(500).send(`Error al eliminar algunos archivos: ${deletionErrors.join(', ')}`);
    }

    res.send("Papelera vaciada con éxito");
  });
};

export { upload };