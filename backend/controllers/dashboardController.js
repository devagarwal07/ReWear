import User from '../models/User.js';
import ClothingItem from '../models/ClothingItem.js';
import Swap from '../models/Swap.js';

export const getDashboard = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId })
            .populate({ path: 'listings', populate: { path: 'uploader' } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        // My Listings
        const myListings = user.listings;
        // My Purchases (items where user is the 'to' in a completed swap)
        const myPurchasesSwaps = await Swap.find({ to: user._id, status: 'completed' }).populate('item');
        const myPurchases = myPurchasesSwaps.map(swap => swap.item);
        // Stats
        const stats = {
            points: user.points,
            listingsCount: myListings.length,
            purchasesCount: myPurchases.length,
            swapsCount: await Swap.countDocuments({ $or: [{ from: user._id }, { to: user._id }] })
        };
        // Profile
        const profile = {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin,
        };
        res.json({ profile, stats, myListings, myPurchases });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getAdminDashboard = async (req, res) => {
    try {
        const users = await User.find();
        const listings = await ClothingItem.find().populate('uploader');
        const swaps = await Swap.find().populate('item from to');
        res.json({ users, listings, swaps });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
