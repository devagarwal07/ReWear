import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['swap', 'points'], required: true },
    status: { type: String, default: 'pending' }, // pending, completed, rejected
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Swap', swapSchema);
