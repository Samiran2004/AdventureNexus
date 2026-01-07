import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { config } from '../config/config';

dotenv.config();

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_CLOUD_API_KEY,
    api_secret: config.CLOUDINARY_CLOUD_API_SECRET,
});

export default cloudinary;
