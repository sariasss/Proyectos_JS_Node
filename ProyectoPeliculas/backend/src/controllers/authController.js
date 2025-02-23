// se encarga de los controladores de autenticación

// librería para generar y verificar jwt
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// controlador del login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
    
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({ message: 'Credenciales Incorrectas.' });
        };
    
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:'1h'});
    
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'strict'
        });
        res.json({
            message: 'Inicio de sesión exitoso.',
            token,
            success:true,
            user: {
                id: user._id,
                username: user.username,
            }
        });
    } catch (error) {
        res.status(400).json({ success:false, messaje:"Error en el inicio de sesion"});
    }

};

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }
        const user = new User({ username, password });

        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'strict'
        });

        res.status(201).json({
            message: 'Registro exitoso.',
            token,
            success:true, 
            user: {
                id: user._id,
                username: user.username,
            }
        });

    } catch (error) {
        console.error("Error en register:", error);
        res.status(400).json({ success:false, messaje:"Error en el registro"});
    }
};


const logout = async (req, res) => {
    res.cookie('token','',{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // solo en producción
        maxAge: 0, // caducar la cookie inmediatamente
    });
    res.json({ message:'Sesión cerrada con existo.' });
};

const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'No autorizado. Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario autenticado', user });
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};


export { login, register, logout, checkAuth };