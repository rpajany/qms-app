import express from 'express';
import multer from 'multer';
import { configureMulterStorage } from '../helpers/filehelper.js';
import { uploadFiles, delete_UploadedFilesFolder } from '../controller/FileUpload_Controller.js';

const router = express.Router();
const storage = configureMulterStorage();
const upload = multer({ storage });

// Define the upload route
// router.post('/upload', upload.array('files'), uploadFiles);
// router.post('/upload', upload.array('files'));
router.post('/delete-upload', delete_UploadedFilesFolder);
export default router;
