import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import ErrorPages from "../pages/ErrorPages";
import MovieDetail from "../pages/MovieDetail";
import MovieList from "../pages/MovieList";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/ProtectedRoute";
import SearchPage from "../pages/SearchPage";
import Review from "../pages/Review";
import Favourites from "../pages/Favourites";
/*
import Search from "../pages/Search";
import Review from "../pages/Review";
import Favourites from "../pages/Favourites";
*/

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPages />,
    children: [
      {
        index:true,
        element:<Navigate to="login" replace />,
      },
      {
        path:"login",
        element: <LoginPage />
      },
      {
        path:"register",
        element: <RegisterPage />
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "movies",
        element: <MovieList />
      },
      {
        path: "movie/:id",
        element: <MovieDetail />
      },
      {
        path: "search",
        element: <SearchPage />
      },
      {
        path: "reviews",
        element: (
            <ProtectedRoute >
                <Review />
            </ProtectedRoute>
        )
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <Favourites />
          </ProtectedRoute>
        )
      }
    ]
  }
]);