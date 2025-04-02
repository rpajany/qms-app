import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import db from '../config/db.js';

// Get the __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to delete folder and its contents
export const deleteFolderRecursive = async (folder, Audit_UID) => {
    // console.log('folder', folder)
    try {
        // delete tbl_uploads Data
        const [result] = await db.query('DELETE  FROM tbl_uploads WHERE Audit_UID = ?', [Audit_UID]);

        console.log(`delete tbl_uploads Data for Audit_UID=${Audit_UID} :`, result)


    } catch (error) {
        console.error('Error deleting tbl_uploads Data :', error);
        throw error;
    }


    try {
        const entries = await fs.readdir(folder, { withFileTypes: true });
        for (const entry of entries) {
            const curPath = path.join(folder, entry.name);
            if (entry.isDirectory()) {
                await deleteFolderRecursive(curPath);
            } else {
                await fs.unlink(curPath); // Delete file
            }
        }
        await fs.rmdir(folder); // Delete folder

        // return true;

        // Return data
        return {
            success: true,
            message: `Successfully deleted Folders & tbl_uploads Data : ${Audit_UID}`,
            data: [] // result.affectedRows
        };
    } catch (error) {
        console.error("Error deleteFolderRecursive:", error);
        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
};

// get upload data ....
export const get_uploadFiles_ByUID = async (Audit_UID) => {
    try {
        const [result] = await db.query('SELECT * FROM tbl_uploads WHERE Audit_UID = ?', [Audit_UID]);

        // Return data
        return {
            success: true,
            message: `Successfully Get_uploadFiles_ByUID : ${Audit_UID}`,
            data: result,
        };

    } catch (error) {
        console.error("Error Get_AuditDetail_ByDocNo :", error);
        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// Delete Old Upload File ....
export const Delete_OldUploadFile = async (FilePath, id) => {
    try {
        // delete mySql date from tbl_uploads
        const [result] = await db.query('DELETE  FROM tbl_uploads WHERE id = ?', [id]);

        // Resolve the full path using process.cwd() for app root
        const fullPath = path.resolve(process.cwd(), FilePath);

        // Check if file exists
        try {
            await fs.access(fullPath);
            console.log(`File found: ${fullPath}`);
        } catch (accessErr) {
            if (accessErr.code === 'ENOENT') {
                console.error(`Error: File not found at ${fullPath}`);
                return; // Exit the function if file doesn't exist
            }
            throw accessErr; // Re-throw for other unexpected errors
        }

        // Delete the file
        try {
            await fs.unlink(fullPath);
            console.log(`File deleted successfully: ${fullPath}`);
        } catch (unlinkErr) {
            console.error(`Error deleting file: ${unlinkErr.message}`);
            return; // Log and exit if unable to delete
        }

        return {
            success: true,
            message: `File and Data deleted successfully: ${fullPath}`,
            data: [] //result
        }

    } catch (error) {
        console.error("Error Delete_OldUploadFile :", error);
        // Optionally throw the error to the controller
        return {
            success: false,
            message: error.message,
        };
    }
}

// Download File by File_Path ....
export const Download_FilePath = async (File_Path) => {
    try {


    } catch (error) {

    }
}


