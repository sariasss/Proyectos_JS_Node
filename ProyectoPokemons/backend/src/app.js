import express from "express";
import cors from "cors";
import pokemonRoutes from "./routers/pokemonRouter.js";
import favoriteRoutes from "./routers/favoriteRouter.js";
import { connectDB } from "./data/data.js";

const app = express();

// Configuración de CORS
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5173/'
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas
app.use("/api/pokemon", pokemonRoutes);
app.use("/api/favorite", favoriteRoutes);

// Ruta raíz para verificar que el servidor está funcionando
app.get("/", (req, res) => {
    res.json({ message: "API Pokemon funcionando" });
});

export default app;