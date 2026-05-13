import cloudinary from './cloudinary.js';

export const uploadToCloudinary = async (fileBuffer: Buffer, originalName: string) => {
    try {
        const base64 = fileBuffer.toString('base64');
        const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64}`, {
            folder: 'Deco moja',
        });
        return uploadResult.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};
