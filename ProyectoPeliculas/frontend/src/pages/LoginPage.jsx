import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const LoginPage = () => {
    //hook para trabajar con el login
    const { login , setError, user, token} = useAuth();

    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username:"", password: "" });

    const handleChange = (e) =>{
        const { name, value } = e.target;
        setFormData(prevalue => (
            {
                ...prevalue,
                [name]: value
            }
        ));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const successs = await login(formData);
            if (successs) {
                navigate("/home");
            }
        } catch (error) {
            setError(error);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-2 text-center text-4xl font-bold text-gray-900">Iniciar Sesión</h2>
                <form className="mt-8 space-y-8" onSubmit={handleSubmit}>

                    {/*Elementos del form */}
                    <div>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <label htmlFor="">Username:  </label>
                            <input type="username" 
                                className="relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-900 focus:border-sky-900 focus:z-10 sm:text-sm'"
                                id="username"
                                name="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="username"
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <label htmlFor="">Password:  </label>
                            <input type="password" 
                                className="relative block w-full px-3 py-2 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-900 focus:border-sky-900 focus:z-10 sm:text-sm'"
                                id="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="*********"
                            />
                        </div>
                    </div>
                    <div>
                        <button  
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-950 hover:bg-sky-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-950"
                            type="submit"
                        >
                            Iniciar sesion
                        </button>
                    </div>
                </form>
                <NavLink to="/register" className="hover:text-amber-400">¿No tienes cuenta? Registrate</NavLink>
            </div>
        </div>
    )
}

export default LoginPage