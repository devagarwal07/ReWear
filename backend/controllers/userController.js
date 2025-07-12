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
