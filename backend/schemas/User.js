import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    points: { type: Number, default: 0 },
    avatar: String,
});

export default mongoose.model('User', userSchema);
