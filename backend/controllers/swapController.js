import Swap from '../models/Swap.js';

export const createSwap = async (req, res) => {
    try {
        const swap = new Swap(req.body);
        await swap.save();
        res.json(swap);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getSwapsForUser = async (req, res) => {
    try {
        const swaps = await Swap.find({ $or: [{ from: req.params.userId }, { to: req.params.userId }] })
            .populate('item from to');
        res.json(swaps);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const completeSwap = async (req, res) => {
    try {
        const swap = await Swap.findByIdAndUpdate(
            req.params.id,
            { status: 'completed' },
            { new: true }
        );
        res.json(swap);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const rejectSwap = async (req, res) => {
    try {
        const swap = await Swap.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        res.json(swap);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
