import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext";


const RootLayout = () => {
    const { logout } = useAuth();
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <nav className="bg-sky-950 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                    {/**Seccion izquierda del nav */}
                    <div className="flex items-center">
                        {/**Titulo */}
                        <NavLink to="/home" className="text-lg font-bold hover:text-amber-400">VideoClub</NavLink>
                        <div className="flex space-x-4 ml-10">
                            <NavLink to="/movies" className="hover:text-amber-400">Peliculas</NavLink>
                            <NavLink to="/search" className="hover:text-amber-400">Buscar</NavLink>
                            <NavLink to="/reviews" className="hover:text-amber-400">Mis reseñas</NavLink>
                            <NavLink to="/favorites" className="hover:text-amber-400">Favoritos</NavLink>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <NavLink to="/" className="hover:text-amber-400" onClick={()=>logout()}>Cerrar Sesion</NavLink>
                    </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow max-w-7xl mx-auto px-4 py-6">
                <Outlet />
            </main>
            <footer className="bg-sky-950 text-white text-center p-4">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <p className="text-center">VideoClub ©2025</p>
                </div>
            </footer>
        </div>
    )
}

export default RootLayout