import { Pokemon } from "../models/database.js";
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = `${process.env.POKEMON_API_URL}?limit=${process.env.POKEMON_LIMIT || 151}`;

export const getPokemons = async (req, res) => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error("Error en la url");
        }
        const data = await response.json();

        await Pokemon.deleteMany({});

        const pokemonPromises = data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            if (!detailResponse.ok) {
                throw new Error(`Error obteniendo detalles de ${pokemon.name}`);
            }
            const pokemonData = await detailResponse.json();
            
            return {
                id: pokemonData.id,
                name: pokemonData.name,
                types: pokemonData.types,
                sprites: {
                    front_default: pokemonData.sprites.front_default,
                    other: {
                        dream_world: {
                            front_default: pokemonData.sprites.other.dream_world.front_default
                        }
                    }
                },
                stats: pokemonData.stats
            };
        });

        const pokemonDetails = await Promise.all(pokemonPromises);
        await Pokemon.insertMany(pokemonDetails);

        const pokemons = await Pokemon.find();
        res.status(200).json(pokemons);

    } catch (error) {
        console.error("Error al obtener los pokemons:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getPokemonByValue = async (req, res) => {
    try {
        const { value } = req.params;
        let pokemon;

        // Primero intentamos buscar por ID
        if (!isNaN(value)) {
            pokemon = await Pokemon.findOne({ id: parseInt(value) });
        }

        // Si no se encuentra por ID, buscamos por nombre
        if (!pokemon) {
            pokemon = await Pokemon.findOne({ 
                name: value.toLowerCase().trim() 
            });
        }

        if (!pokemon) {
            return res.status(404).json({ 
                mensaje: `Pokemon ${value} no encontrado` 
            });
        }

        res.json(pokemon);
    } catch (error) {
        console.error("Error en getPokemonByValue:", error);
        res.status(500).json({ 
            mensaje: "Error al obtener el pokemon", 
            error: error.message 
        });
    }
};

