import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "auth-app",
        })
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log("Cloudinary Error →", error.message);
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFromCloudinary = async (imageUrl) => {
    try {
        if(!imageUrl) return null

        const urlParts = imageUrl.split('/')
        const filename = urlParts[urlParts.length - 1]
        const folderName = urlParts[urlParts.length - 2]
        const publicId = `${folderName}/${filename.split('.')[0]}`

        const response = await cloudinary.uploader.destroy(publicId);
        return response;

    } catch (error) {
        console.error("Cloudinary Delete Message:", error.message);
        return null;
    }
}

export { uploadToCloudinary, deleteFromCloudinary }