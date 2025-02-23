import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true },
});

// Hashear la contraseña antes de guardar el usuario
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Validar la contraseña al iniciar sesión
userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
};

// exporto el modelo User
export default mongoose.model("User", userSchema);