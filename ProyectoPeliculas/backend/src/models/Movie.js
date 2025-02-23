import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  original_title: { type: String, required: true },
  original_language: { type: String, required: true },
  overview: { type: String, required: true },
  genre_ids: [{ type: Number }],
  genres: [{ type: String }], 
  release_date: { type: Date, required: true },
  popularity: { type: Number, default: 0 },
  vote_average: { type: Number, default: 0 },
  vote_count: { type: Number, default: 0 },
  adult: { type: Boolean, default: false },
  video: { type: Boolean, default: false },
  backdrop_path: { type: String },
  poster_path: { type: String },
  trailer_key: { type: String, default: null },
  runtime: { type: Number, default: null },
});


export default mongoose.model('Movie', movieSchema);
