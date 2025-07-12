import User from '../models/User.js';

export const createUser = async (req, res) => {
    try {
        const { clerkId, name, email, avatar } = req.body;
        let user = await User.findOne({ clerkId });
        if (!user) {
            user = new User({ clerkId, name, email, avatar });
            await user.save();
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.clerkId });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const registerClerkUser = async (req, res) => {
    try {
        const { clerkId, name, email, avatar } = req.body;
        let user = await User.findOne({ clerkId });
        if (!user) {
            user = new User({ clerkId, name, email, avatar });
            await user.save();
        }
        res.status(201).json({ success: true, user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { clerkId, name, email, phone, address, avatar } = req.body;
        const user = await User.findOneAndUpdate(
            { clerkId },
            { $set: { name, email, phone, address, avatar } },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
