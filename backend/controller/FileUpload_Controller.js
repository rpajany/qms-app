import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../config/db.js';

import * as fileUploadModel from '../models/fileUpload_model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFiles = async (req, res) => {
    const folderName = req.body.FolderName; //req.body.folderName;

    console.log('folderName : ', req.body.FolderName)
    console.log('req.files : ', req.files)
    try {
        // const uploadedFiles = req.files.map(async (file) => {
        const uploadedFiles = req.files.forEach(async (file) => {
            const filePath = path.join('uploads', folderName, file.filename);

            // Insert file info into the database
            const sql = `INSERT INTO tbl_uploads (Doc_No, Clause, File_Name, File_Path) VALUES (?, ?, ?,?)`;
            await db.execute(sql, [folderName, file.filename, filePath]);

            return { fileName: file.filename, filePath };
        });

        await Promise.all(uploadedFiles); // Wait for all database inserts to complete

        res.status(200).json({
            message: 'Files uploaded and paths saved to database successfully.',
            files: req.files.map((file) => ({
                fileName: file.filename,
                filePath: path.join('uploads', folderName, file.filename),
            })),
        });
    } catch (err) {
        console.error('Error uploading files:', err);
        res.status(500).json({ message: 'Error uploading files.', error: err.message });
    }
};


// Function to save the folder name and file path into the MySQL database
export const saveFileDetailsToDatabase = (folderName, Clause, filename, filePath) => {
    // console.log('db function called ...')
    const query = 'INSERT INTO tbl_uploads (Doc_No, Clause, File_Name, File_Path) VALUES (?, ?,?,?)';
    db.query(query, [folderName, Clause, filename, filePath], (err, results) => {
        if (err) {
            console.error('Error saving to database:', err);
        } else {
            console.log('File details saved to database:', results);
        }
    });
};



export const delete_UploadedFilesFolder = async (req, res) => {
    let { folderPath } = req.body;

    // Convert folderPath to a string
    folderPath = String(folderPath);

    if (!folderPath) {
        return res.status(400).json({ error: 'Folder path is required' });
    }

    // const fullPath = path.join(__dirname, 'uploads', folderPath);
    // const fullPath = path.resolve(`uploads/${folderPath}`);
    const fullPath = path.resolve(process.cwd(), 'uploads', folderPath);
    // Check if the folder exists
    // if (!fs.existsSync(fullPath)) {
    //     return res.status(404).json({ error: 'Folder not found' });
    // }

    try {
        await fileUploadModel.deleteFolderRecursive(fullPath);
        res.status(200).json({ message: `Folder '${folderPath}' deleted successfully.` });
    } catch (error) {
        console.error('Error deleting folder:', error);
        res.status(500).json({ error: 'Error deleting folder' });
    }

}