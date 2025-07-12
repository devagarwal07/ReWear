import ClothingItem from '../models/ClothingItem.js';
import User from '../models/User.js';
import { uploadImage } from '../services/cloudinaryService.js';
import fs from 'fs';
import mongoose from 'mongoose';

export const createItem = async (req, res) => {
    try {
        // Validate uploader is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.body.uploader)) {
            return res.status(400).json({ error: 'Invalid uploader: must be a valid MongoDB ObjectId.' });
        }
        const item = new ClothingItem(req.body);
        await item.save();
        // Add the item to the user's listings array
        await User.findByIdAndUpdate(item.uploader, { $push: { listings: item._id } });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getItems = async (req, res) => {
    try {
        const items = await ClothingItem.find().populate('uploader');
        res.json(items);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getItem = async (req, res) => {
    try {
        const item = await ClothingItem.findById(req.params.id).populate('uploader');
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateItem = async (req, res) => {
    try {
        const item = await ClothingItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        await ClothingItem.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const approveItem = async (req, res) => {
    try {
        const item = await ClothingItem.findByIdAndUpdate(
            req.params.id,
            { isApproved: true, isSpam: false, isRemoved: false },
            { new: true }
        );
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const rejectItem = async (req, res) => {
    try {
        const item = await ClothingItem.findByIdAndUpdate(
            req.params.id,
            { isApproved: false, isSpam: true },
            { new: true }
        );
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const removeItem = async (req, res) => {
    try {
        const item = await ClothingItem.findByIdAndUpdate(
            req.params.id,
            { isRemoved: true },
            { new: true }
        );
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const reportItem = async (req, res) => {
    try {
        const item = await ClothingItem.findByIdAndUpdate(
            req.params.id,
            { isSpam: true },
            { new: true }
        );
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const uploadItemImage = async (req, res) => {
    try {
        // Assume req.file.path is the local path to the uploaded file (use multer in route)
        const result = await uploadImage(req.file.path);
        // Optionally delete the local file after upload
        fs.unlinkSync(req.file.path);
        res.json({ url: result.secure_url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
