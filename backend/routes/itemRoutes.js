import express from 'express';
import multer from 'multer';
import {
    createItem, getItems, getItem, updateItem, deleteItem,
    approveItem, rejectItem, removeItem, reportItem,
    uploadItemImage
} from '../controllers/itemController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', createItem);
router.get('/', getItems);
router.get('/:id', getItem);
router.patch('/:id', updateItem);
router.delete('/:id', deleteItem);

// Admin moderation endpoints
router.patch('/:id/approve', approveItem);
router.patch('/:id/reject', rejectItem);
router.patch('/:id/remove', removeItem);

// User report endpoint
router.patch('/:id/report', reportItem);

// Image upload endpoint
router.post('/upload', upload.single('image'), uploadItemImage);

export default router;
