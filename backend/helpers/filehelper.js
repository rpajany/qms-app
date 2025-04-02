// https://chatgpt.com/c/676a72ea-391c-8007-a15d-07f04e2557a2


import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const configureMulterStorage = () => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const folderName = req.body.FolderName;
            const uploadPath = path.join(process.cwd(), 'uploads', folderName);

            // Create the folder if it doesn't exist
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });
};