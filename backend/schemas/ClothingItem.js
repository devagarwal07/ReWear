import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    type: String,
    size: String,
    condition: String,
    tags: [String],
    images: [String],
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'available' }, // available, swapped, reserved
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ClothingItem', itemSchema);
