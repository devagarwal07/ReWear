import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 2, maxlength: 100 },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: String, required: true },
    condition: { type: String, required: true },
    tags: [{ type: String, maxlength: 30 }],
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'available', enum: ['available', 'swapped', 'reserved'] },
    isApproved: { type: Boolean, default: false },
    isSpam: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
    listedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('ClothingItem', itemSchema);
