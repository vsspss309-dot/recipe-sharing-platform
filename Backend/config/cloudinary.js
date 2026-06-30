import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary SDK using credentials in environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dpxlsqskn", // fallback or placeholder if empty
    api_key: process.env.CLOUDINARY_API_KEY || "858882522619717",
    api_secret: process.env.CLOUDINARY_API_SECRET || "default_cloudinary_secret_abcde"
});

export default cloudinary;
