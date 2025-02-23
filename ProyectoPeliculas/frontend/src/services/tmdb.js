const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

// Objeto que me permite decidir el tamaño de las imágenes
export const IMAGES_SIZES = {
    POSTER: "w500",
    BACKDROP: "original",
};

// Función para obtener la URL de una imagen
export const getImageUrl = (path, size = IMAGES_SIZES.POSTER) => {
    if (!path) return "/placeholder-movie.jpg";
    return `${VITE_BASE_IMAGE_URL}/${size}${path}`;
};

// Función general para hacer fetch desde la API
const fetchFromApi = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${VITE_BASE_URL}/${endpoint}?${new URLSearchParams(options)}`);
        if (!response) {
            throw new Error('Error en la petición');
        }
        return await response.json();
    } catch (error) {
        throw new Error("Error en la petición: ", error);
    }
};

// Función para obtener las películas populares (con una página específica)
export const getPopularMovies = async (page = 1) => {
    return fetchFromApi("movies", { page });
};

// Función para obtener los detalles de una película
export const getMovieDetails = async (id) => {
    return fetchFromApi(`movies/${id}`);
};

// Función para buscar películas
export const searchMovies = async (query) => {
    try {
        // Normalize the search query
        const normalizedQuery = query
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        const response = await fetch(`${VITE_BASE_URL}/movies/all`);
        if (!response.ok) {
            throw new Error('Error en la petición');
        }
        const allMovies = await response.json();

        // Filter movies locally
        const filteredMovies = allMovies.filter(movie => {
            const normalizedTitle = movie.title
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();
            
            const normalizedOriginalTitle = movie.original_title
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase();

            return normalizedTitle.includes(normalizedQuery) || 
                   normalizedOriginalTitle.includes(normalizedQuery);
        });

        return { movies: filteredMovies };
    } catch (error) {
        throw new Error("Error en la búsqueda: " + error.message);
    }
};

// Función para obtener todas las páginas de un endpoint
const fetchAllMovies = async () => {
    try {
        const response = await fetch(`${VITE_BASE_URL}/movies/all`);
        if (!response) {
            throw new Error('Error en la petición');
        }
        return await response.json();
    } catch (error) {
        throw new Error("Error en la petición: ", error);
    }
};

export const getRecentMovies = async () => {
    const allMovies = await fetchAllMovies();
    console.log(allMovies);

    return allMovies
        .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
        .slice(0, 10);
};

export const getTopRatedMovies = async () => {
    try {
        const response = await fetchFromApi("movies/all");
        return response
            .sort((a, b) => b.vote_average - a.vote_average)
            .slice(0, 10);
    } catch (error) {
        console.error("Error al obtener las películas mejor valoradas:", error);
        return [];
    }
};
export const getPopular10Movies = async () => {
    try {
        const response = await fetchFromApi("movies", { page: 1 });

        if (response && Array.isArray(response.movies)) {
            return response.movies.slice(0, 10);
        } else {
            throw new Error("La respuesta no contiene un array de películas.");
        }
    } catch (error) {
        console.error("Error al obtener las películas populares:", error);
        return [];
    }
};

