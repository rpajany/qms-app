import { promises as fs } from 'fs';
import path from 'path';

// Function to delete folder and its contents
export const deleteFolderRecursive = async (folder) => {
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
        return true;
    } catch (error) {
        console.error('Error deleting folder:', error);
        throw error;
    }
};