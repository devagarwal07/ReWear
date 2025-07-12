import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, match: /.+@.+\..+/ },
    points: { type: Number, default: 0, min: 0 },
    avatar: { type: String, match: /^https?:\/\/.+/i, required: false },
    phone: { type: String, match: /^\+?[0-9]{10,15}$/, required: false },
    address: { type: String, maxlength: 200, required: false },
    isAdmin: { type: Boolean, default: false },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' }],
    stats: {
        points: { type: Number, default: 0 },
        listingsCount: { type: Number, default: 0 },
        purchasesCount: { type: Number, default: 0 },
        swapsCount: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
