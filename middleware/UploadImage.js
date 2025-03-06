import ImageKit from "imagekit"
import 'dotenv/config'

export const ImageUploadonDB = async (req, res, next) => {
    try {
        const file = req?.file;
        req.uploadedImage = { hasImage: false };
        if (!file) next();
        const imagekit = new ImageKit({
            publicKey: process.env.ImageKit_Public_Key,
            privateKey: process.env.ImageKit_Private_Key,
            urlEndpoint: process.env.ImageKit_ENDPOINT_URL
        })

        const res = await imagekit.upload({
            file: file.buffer.toString("base64"),
            fileName: file.originalname
        });

        if (!res) {
            req.uploadedImage = { hasImage: true, success: false, data: false, message: "Image not Uploaded" };
            next();
        }
        req.uploadedImage = { hasImage: true, success: true, data: res, message: "Image Uploaded" };
        next();
    } catch (error) {
        req.uploadedImage = { hasImage: true, success: false, data: false, message: "Try again" };
        next();
    }
}