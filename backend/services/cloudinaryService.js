import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
});

export const uploadImage = async (filePath, folder = 'rewear') => {
    return cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'image',
        use_filename: true,
        unique_filename: false,
        overwrite: false
    });
};

export default cloudinary;
