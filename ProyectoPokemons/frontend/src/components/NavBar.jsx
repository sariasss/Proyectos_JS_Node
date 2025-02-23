import { NavLink } from "react-router-dom"
import { ROUTES } from "../routes/paths"

const NavBar = () => {
  return (
    <nav className="bg-gradient-to-r from-orange-500 to-amber-500 shadow.lg"> 
    {/* ICONO */}
        <div className="container mx-auto p-4 justify-between flex items-center">
        <NavLink to={ROUTES.HOME} className="text-white text-2xl font-bold"> POKÉDEX </NavLink>
        {/* Contenedor navegación */}
        <div className="space-x-4">
          {/* isActive (callback) */}
          <NavLink to={ROUTES.HOME} className={({ isActive }) => `text-white text-2xl ${isActive ? "font-bold hover:text-black" : ""} `}> Inicio </NavLink>
          <NavLink to={ROUTES.SEARCH} className={({ isActive, }) => `text-white  hover:text-black text-2xl ${isActive ? "font-bold" : ""}`}> Buscar </NavLink>
          <NavLink to={ROUTES.FAVORITES} className={({ isActive, }) => `text-white  hover:text-black text-2xl ${isActive ? "font-bold" : ""}`}> Favoritos </NavLink>
          <NavLink to={ROUTES.ABOUT} className={({ isActive, }) => `text-white  hover:text-black text-2xl ${isActive ? "font-bold" : ""}`}> About </NavLink>
            </div>
        </div>
    </nav>
  )
}

export default NavBar