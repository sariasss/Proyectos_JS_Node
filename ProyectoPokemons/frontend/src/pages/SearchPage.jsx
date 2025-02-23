import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

const VITE_API_URL = import.meta.env.VITE_API_URL;

const SearchPage = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!search.trim()) {
            toast.error("Por favor ingresa un nombre de Pokemon", {
                style: {
                    background: "#fef2f2",
                    border: "1px solid #ff",
                    color: "#991b1b"
                }
            });
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pokemon/${search.toLowerCase()}`);
            if (!response.ok) {
                throw new Error("Pokemon no encontrado");
            }

            const data = await response.json();
            navigate(`/search/${search.toLowerCase()}`);

        } catch (error) {
            toast.error("Pokemon no encontrado", {
                style: {
                    background: "#fef2f2",
                    border: "1px solid #ff",
                    color: "#991b1b"
                }
            });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Buscar Pokemon</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Ingresa el nombre del Pokemon" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button 
                        type="submit" 
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        Buscar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchPage