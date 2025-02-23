// importaciones
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./paths";
import RootLayout from "../layouts/RootLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import FavoritesPage from "../pages/FavoritesPage";
import AboutPage from "../pages/AboutPage";
import PokemonDetailPage from "../pages/PokemonDetailPage";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: ROUTES.HOME,
                element: <Home />
            },
            {
                path: ROUTES.SEARCH,
                element: <SearchPage />
            },
            {
                path: `${ROUTES.SEARCH}/:name`,
                element: <PokemonDetailPage />,
                loader: async ({ params }) => {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/pokemon/${params.name}`);
                    if (!response.ok) {
                        throw new Error("Pokemon no encontrado");
                    }
                    return response.json();
                }
            },
            {
                path: ROUTES.FAVORITES,
                element: <FavoritesPage />
            },
            {
                path: ROUTES.ABOUT,
                element: <AboutPage />
            }
        ]
    }
]);