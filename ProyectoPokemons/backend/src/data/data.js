// aqui gestiono la conexion con la base de datos MONGODB
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// funcion para conectar con la bd
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Conexión a MongoDB exitosa");
    } catch (error) {
        console.error("Error con la conexión a la BD:", error);
        process.exit(1);
    }
};