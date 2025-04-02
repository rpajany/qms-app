import express from 'express';
import multer from 'multer';
import { configureMulterStorage } from '../helpers/filehelper.js';
import { uploadFiles, Get_UploadFiles_ByUID, delete_UploadedFilesFolder, DeleteByFilePath, File_Download, File_Stream_Download, File_Send, Express_FileDownload } from '../controller/FileUpload_Controller.js';

const router = express.Router();
const storage = configureMulterStorage();
const upload = multer({ storage });

// Define the upload route
router.get('/getByUID/:Audit_UID', Get_UploadFiles_ByUID);
router.post('/deleteByFilePath', DeleteByFilePath);
// router.get('/download/:File_Path', File_Download);
// router.post('/download', File_Download);
// router.post('/download', File_Send);
router.post('/download', Express_FileDownload);
router.post('/delete-upload', delete_UploadedFilesFolder);


export default router;
