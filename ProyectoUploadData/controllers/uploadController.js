// controllers/uploadController.js
import fs from "fs";
import multer from "multer";
import path from "path";
import sgMail from "@sendgrid/mail";

// Configuración de Multer: almacenamiento y nombres de archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta donde se guardarán los archivos subidos
    cb(null, path.join(process.cwd(), "uploads"));

  },
  filename: (req, file, cb) => {
    // Guardamos el archivo con un nombre único basado en la fecha y el nombre original
    // cb(null, `${Date.now()}-${file.originalname}`);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Controlador para subir archivo
export const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No se ha subido ningún archivo");
    }

    const originalPath = path.join(process.cwd(), "uploads", req.file.filename);
    const copyPath = path.join(process.cwd(), "recycle", req.file.filename);

    fs.copyFile(originalPath, copyPath, (copyErr) => {
      if (copyErr) {
        return res.status(500).send("Error al copiar el archivo");
      }
      res.send(`Archivo subido y copiado con éxito: ${req.file.filename}`);
    });

  } catch (error) {
    res.status(500).send("Error al subir archivo");
  }
};


// Controlador para listar los archivos subidos
export const listFiles = (req, res) => {
  const uploadDir = path.join(process.cwd(), "uploads");
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).send("Error al listar archivos");
    }
    res.json(files);
  });
};

// Controlador para eliminar un archivo
export const deleteFile = (req, res) => {
  const fileName = req.params.fileName; 
  const filePath = path.join(process.cwd(), "uploads", fileName);
  const recyclePath = path.join(process.cwd(), "recycle", fileName);

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send(`Archivo no encontrado: ${fileName}`);
    }

    // Ensure recycle directory exists
    const recycleDir = path.join(process.cwd(), "recycle");
    if (!fs.existsSync(recycleDir)) {
      fs.mkdirSync(recycleDir, { recursive: true, mode: 0o777 });
    }

    // Use copyFileSync and unlinkSync for better error handling
    fs.copyFileSync(filePath, recyclePath);
    fs.unlinkSync(filePath);
    
    res.send(`Archivo ${fileName} movido a papelera (recycle/)`);
  } catch (error) {
    console.error('Error moving file:', error);
    res.status(500).send(`Error al mover archivo: ${fileName}`);
  }
};



//___________________________________________________________________________________________
async function calculateSize(directory) {
  try {
    const files = await fs.promises.readdir(directory, { withFileTypes: true });

    let size = 0;

    for (const file of files) {
      const filePath = path.join(directory, file.name);
      try {
        if (file.isDirectory()) {
          // Si es una carpeta, calcular su tamaño recursivamente
          size += await calculateSize(filePath);
        } else {
          // Si es un archivo, añadir su tamaño
          const stats = await fs.promises.stat(filePath);
          size += stats.size;
        }
      } catch (err) {
        console.error(`Error al procesar el archivo/carpeta ${filePath}:`, err);
      }
    }

    return size;
  } catch (err) {
    console.error(`Error al acceder a la carpeta ${directory}:`, err);
    throw err; // Volver a lanzar el error para que se maneje en el controlador
  }
}

// Controlador para obtener las estadísticas de almacenamiento
export const getFolderSize = async (req, res) => {
  try {
    const uploadsPath = path.resolve('uploads');
    const recyclePath = path.resolve('recycle');

    const uploadsSize = await calculateSize(uploadsPath);
    const recycleSize = await calculateSize(recyclePath);

    res.json({ uploadsSize, recycleSize });
  } catch (error) {
    console.error("Error en getFolderSize:", error);
    res.status(500).json({ error: error.message });
  }
};



export const getStorageStats = async (req, res) => {
  try {
    const uploadsSize = await getFolderSize(path.join(process.cwd(), "uploads"));
    const recycleSize = await getFolderSize(path.join(process.cwd(), "recycle"));

    res.json({
      uploadsSize,
      recycleSize, 
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas de almacenamiento" });
  }
};

//_____________________________________________________________________________________________
// Función para obtener el tamaño total de una carpeta (recursiva)
const getTotalFolderSize = (folderPath) => {
  let totalSize = 0;

  const getSizeRecursive = (currentPath) => {
    try {
      const stats = fs.statSync(currentPath);
      if (stats.isDirectory()) {
        const files = fs.readdirSync(currentPath);
        files.forEach(file => getSizeRecursive(path.join(currentPath, file)));
      } else {
        totalSize += stats.size;
      }
    } catch (err) {
      console.error(`Error obteniendo tamaño de: ${currentPath}`, err);
    }
  };

  getSizeRecursive(folderPath);
  return totalSize;
};

const uploadsDir = path.join(process.cwd(), "uploads");
const recycleDir = path.join(process.cwd(), "recycle");

// Función para obtener el resumen de archivos
const getFilesSummary = () => {
  const uploadFiles = fs.readdirSync(uploadsDir);
  const recycleFiles = fs.readdirSync(recycleDir);

  const uploadSize = getTotalFolderSize(uploadsDir) / (1024 * 1024);  // Convertido a MB
  const recycleSize = getTotalFolderSize(recycleDir) / (1024 * 1024); // Convertido a MB

  return {
    uploadFiles,
    recycleFiles,
    uploadSize: uploadSize.toFixed(2),  // Redondeado a 2 decimales
    recycleSize: recycleSize.toFixed(2)
  };
};

//funcion para enviar el mail 
export const sendSummaryEmail = async (recipientEmail) => {
  const summary = getFilesSummary();

  const emailContent = `
    <h1>Resumen de Archivos Almacenados</h1>
    <h2>Carpeta de Uploads:</h2>
    <ul>
      ${summary.uploadFiles.map(file => `<li>${file}</li>`).join('')}
    </ul>
    <p><strong>Total en Uploads:</strong> ${summary.uploadSize} MB</p>

    <h2>Carpeta de Recycle:</h2>
    <ul>
      ${summary.recycleFiles.map(file => `<li>${file}</li>`).join('')}
    </ul>
    <p><strong>Total en Recycle:</strong> ${summary.recycleSize} MB</p>
  `;

  const msg = {
    to: recipientEmail, // Se utiliza el parámetro recibido
    from: "sara.arias085@gmail.com", // Debe estar verificado en SendGrid
    subject: "Resumen de Archivos Almacenados",
    html: emailContent
  };

  try {
    await sgMail.send(msg);
    console.log(`📧 Resumen enviado a ${recipientEmail} con éxito.`);
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
  }
};


export { upload };