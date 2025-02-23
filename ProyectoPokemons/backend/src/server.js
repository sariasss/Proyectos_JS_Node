import app from "./app.js";
import dotenv from "dotenv";

// levanto el server
dotenv.config(); // carga las variables de entorno

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});