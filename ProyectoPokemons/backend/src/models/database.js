import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  types: [{
    slot: Number,
    type: {
      name: String,
      url: String
    }
  }],
  sprites: {
    front_default: String,
    other: {
      dream_world: {
        front_default: String
      }
    }
  },
  stats: [{
    base_stat: Number,
    effort: Number,
    stat: {
      name: String,
      url: String
    }
  }]
});

const favoriteSchema = new mongoose.Schema({
    pokemonId: { type: Number, required: true },
    pokemon: pokemonSchema
});

export const Pokemon = mongoose.model('Pokemon', pokemonSchema);
export const Favorite = mongoose.model('Favorite', favoriteSchema);
