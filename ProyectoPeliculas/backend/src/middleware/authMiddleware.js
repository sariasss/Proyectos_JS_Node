import jwt from 'jsonwebtoken';
// middelware para verificar el token

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token, no se puede acceder' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.userId;

        next();
    } catch (error) {
        console.error("Error al verificar el token:", error);
        res.status(500).json({ message: 'Error validando el token' });
    }
};
export default authMiddleware;