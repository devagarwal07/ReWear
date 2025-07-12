import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 2, maxlength: 100 },
    description: { type: String, required: true, minlength: 10, maxlength: 1000 },
    category: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: String, required: true },
    condition: { type: String, required: true },
    tags: [{ type: String, maxlength: 30 }],
    images: [{ type: String, match: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i }],
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'available', enum: ['available', 'swapped', 'reserved'] },
    isApproved: { type: Boolean, default: false },
    isSpam: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
    listedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    swapType: { type: String, enum: ['direct', 'points'], required: true },
    priceInPoints: { type: Number, min: 0 },
}, { timestamps: true });

// Custom validation for priceInPoints
itemSchema.pre('validate', function (next) {
    if (this.swapType === 'points' && (this.priceInPoints === undefined || this.priceInPoints === null)) {
        this.invalidate('priceInPoints', 'Price in points is required for point-based listings');
    }
    next();
});

export default mongoose.model('ClothingItem', itemSchema);
