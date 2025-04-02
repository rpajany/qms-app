//  import fs from 'fs'; // Standard fs module for streams

import cors from 'cors';
import { promises as fs } from 'fs';

// import { promises as fsPromises } from 'fs'; // Promises-based fs for async operations
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
            const sql = `INSERT INTO tbl_uploads (Audit_UID, Clause, File_Name, File_Path) VALUES (?, ?, ?,?)`;
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
export const saveFileDetailsToDatabase = (Audit_UID, Clause, filename, filePath) => {
    try {
        // console.log('db function called ...')
        const query = 'INSERT INTO tbl_uploads (Audit_UID, Clause, File_Name, File_Path) VALUES (?, ?,?,?)';
        db.query(query, [Audit_UID, Clause, filename, filePath], (err, results) => {
            if (err) {
                console.error('Error saving to database:', err);
            } else {
                console.log('File details saved to database:', results);
            }
        });
    } catch (error) {
        console.error('Error in saveFileDetailsToDatabase :', error);
        res.status(500).json({ error: 'Error in saveFileDetailsToDatabase' });
    }

};



export const delete_UploadedFilesFolder = async (req, res) => {
    let { folderPath } = req.body;


    if (!folderPath) {
        return res.status(500).json({ error: 'Error folderPath Missing !' });
    }
    // console.log('tbl_uploads delete :', folderPath)

    const Audit_UID = folderPath;


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
        await fileUploadModel.deleteFolderRecursive(fullPath, Audit_UID);
        res.status(200).json(
            {
                success: true,
                message: `Folder '${folderPath}' deleted successfully.`,
                data: ""
            });
    } catch (error) {
        console.error('Error deleting folder:', error);
        res.status(500).json({ error: 'Error deleting folder' });
    }

}

export const Get_UploadFiles_ByUID = async (req, res) => {
    try {
        const { Audit_UID } = req.params;
        // console.log('Doc_No', Doc_No)
        const rowsData = await fileUploadModel.get_uploadFiles_ByUID(Audit_UID);
        res.status(200).json(rowsData);

    } catch (error) {
        console.error('Error Get_UploadFiles_ByDocNo :', error);
        res.status(500).json({ error: 'Error Get_UploadFiles_ByDocNo' });
    }
}


export const DeleteByFilePath = async (req, res) => {
    try {
        const { FilePath, id } = req.body;
        const decodedFilePath = decodeURIComponent(FilePath);

        const result = await fileUploadModel.Delete_OldUploadFile(decodedFilePath, id);
        res.status(200).json(result);

    } catch (error) {
        console.error('Error Delete_OldUploadFile :', error);
        res.status(500).json({ error: 'Error Delete_OldUploadFile' });
    }
}

// Direct Client Download ...
export const File_Download = async (req, res) => {

    try {
        const { Audit_UID, File_Name, File_Path } = req.body.file;
        // const { Doc_No, File_Name, File_Path } = req.body;


        // Resolve the full path using process.cwd() for app root
        const uploadsDir = path.resolve(process.cwd(), 'uploads', Audit_UID);
        const fullPath = path.join(uploadsDir, File_Name);

        console.log('fullPath :', fullPath)

        // Check if the file exists before downloading
        // if (!fs.existsSync(fullPath)) {
        //     return res.status(404).send('File not found.');
        // }




        try {
            await fs.access(fullPath);

        } catch {
            return res.status(404).send('File not found.');
        }

        // cors({
        //     exposedHeaders: ['Content-Disposition'],
        // }),


        // Set headers explicitly for file download
        // res.setHeader('Content-Disposition', `attachment; filename="${File_Name}"`);
        // res.setHeader('Content-Type', 'application/octet-stream');

        // Send the file for download
        try {
            res.download(fullPath, File_Name, (err) => {
                if (err) {
                    console.error('Error sending file to client:', err);
                    res.status(500).send('Error sending the file.');
                }
            });
        } catch (error) {
            console.error('Error in File_Download:', error);
            res.status(500).send('Error processing the request.');
        }





        res.on('finish', () => {
            console.log('Headers:', res.getHeaders());
        });

        // Stream the file to the client
        // const fileStream = fs.createReadStream(fullPath);
        // const fileStream = fs.readFileSync(fullPath);
        // fileStream.pipe(res);
        // res.send(fileStream);

        // fileStream.on('error', (error) => {
        //     console.error('Error reading file:', error);
        //     res.status(500).send('Error downloading the file.');
        // });

        // Send the file to the client
        // res.download(fullPath, (err) => {
        //     if (err) {
        //         console.error('Error while downloading file:', err);
        //         if (err.code === 'ENOENT') {
        //             // File not found
        //             res.status(404).send('File not found');
        //         } else {
        //             // Other errors
        //             res.status(500).send('Internal server error');
        //         }
        //     }
        // });




    } catch (error) {
        console.error('Error in File_Download:', error);
        res.status(500).json({ error: 'Error in File_Download' });
    }
}

// file download using sendFile ....
export const File_Send = async (req, res) => {
    try {
        const { Audit_UID, File_Name } = req.body.file; // Assuming the file details are sent in the request body

        // Resolve the file path
        const uploadsDir = path.resolve(process.cwd(), 'uploads', Audit_UID); // Directory structure: /uploads/<Audit_UID>
        const fullPath = path.join(uploadsDir, File_Name);

        console.log('Resolved file path:', fullPath);

        // Check if the file exists
        if (!fullPath || !File_Name) {
            return res.status(400).send('Invalid file path or name.');
        }

        // Use res.sendFile to send the file to the client
        res.sendFile(fullPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                if (err.code === 'ENOENT') {
                    // File not found
                    res.status(404).send('File not found.');
                } else {
                    // Other errors
                    res.status(500).send('Internal server error.');
                }
            } else {
                console.log('File sent successfully:', File_Name);
            }
        });
    } catch (error) {
        console.error('Error in File_Send:', error);
        res.status(500).send('Error processing the request.');
    }
};


// file download using File Stream ....
export const File_Stream_Download = async (req, res) => {
    try {
        const { Audit_UID, File_Name } = req.body.file; // Assuming file details are sent in the request body

        // Resolve the file path
        const uploadsDir = path.resolve(process.cwd(), 'uploads', Audit_UID); // Directory structure: /uploads/<Audit_UID>
        const fullPath = path.join(uploadsDir, File_Name);

        console.log('Resolved file path:', fullPath);

        // Check if the file exists
        try {
            // await fs.promises.access(fullPath, fs.constants.R_OK); // Check read permissions
        } catch (err) {
            console.error('File not accessible:', err);
            return res.status(404).send('File not found.');
        }

        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${File_Name}"`);
        res.setHeader('Content-Type', 'application/octet-stream'); // Force download as a binary file

        // Create a read stream and pipe it to the response
        const fileStream = fs.createReadStream(fullPath);

        fileStream.pipe(res);

        fileStream.on('error', (err) => {
            console.error('Error reading file:', err);
            res.status(500).send('Error downloading the file.');
        });

        fileStream.on('close', () => {
            console.log('File streamed successfully:', File_Name);
        });

    } catch (error) {
        console.error('Error in File_Stream_Download:', error);
        res.status(500).send('Error processing the request.');
    }
};

export const Express_FileDownload = async (req, res) => {
    try {
        // console.log(req.body)
        const { Audit_UID, File_Name } = req.body; // Assuming file details are sent in the request body

        // Resolve the file path
        const uploadsDir = path.resolve(process.cwd(), 'uploads', String(Audit_UID)); // Directory structure: /uploads/<Audit_UID>
        const fullPath = path.join(uploadsDir, File_Name);

        // console.log('fullPath', fullPath);

        // The res.download() talking file path to be downloaded
        // res.download(__dirname + "/uploads/Ashwanth Akshaya.pdf", function (err) {
        res.download(fullPath, function (err) {
            if (err) {
                console.log(err);
            }
        });
    } catch (error) {
        console.error('Error in Express_FileDownload :', error);
        res.status(500).send('Error processing the request.');
    }
}