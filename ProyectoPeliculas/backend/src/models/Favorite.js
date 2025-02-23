import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    movieId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model('Favorite', favoriteSchema);