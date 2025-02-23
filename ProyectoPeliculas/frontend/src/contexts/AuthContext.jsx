import { useContext, useState } from "react";
import { createContext } from "react";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useProduct se debe usar dentro de un contexto");
    }
    return context;
}

export const AuthProvider = ({ children }) =>{
 
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(
        ()=> !!localStorage.getItem("token") //localStorage.getItem("token") ? true : false  //token ? true : false //!!token
    )

    const register = async ({ username, password }) =>{
        try {
            const response = await fetch(`${VITE_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });
            if(!response.ok){
                throw new Error("Error al hacer el fecth al register");
            } 
            const data = await response.json();
            setUser(data.user);
            setToken(data.token);
            setIsAuthenticated(true);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            return data.success;
        } catch (error) {
            setError(error);
            console.log("Error al hacer el register: ", error);
        }finally{
            setLoading(false);
        }
    }

    const login = async (formData) =>{
        const { username, password } = formData;
        try {
            const response = await fetch(`${VITE_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });
            if(!response.ok){   
                if (response.status === 401) {
                    setError("Credenciales incorrectas. Intenta de nuevo.");
                } else {
                    setError("Hubo un problema al intentar iniciar sesión.");
                }
                return;
            }
            const data = await response.json(); //peliculas
            setUser(data.user);
            setToken(data.token);
            setIsAuthenticated(true);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            return data.success;
        } catch (error) {
            setError(error);
            console.error("Error al hacer el login: ", error);
        }finally{
            setLoading(false);
        }
    }

    const logout = () =>{
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);

        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }

    const value = {  //son objetos pero la clave y el valor es el mismo
        user,
        token,
        error,
        setError,
        loading,
        register,
        isAuthenticated,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
    )

}