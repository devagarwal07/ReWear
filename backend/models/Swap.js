import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem', required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['swap', 'points'], required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'rejected'] },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Swap', swapSchema);
