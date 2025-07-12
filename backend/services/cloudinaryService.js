import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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
