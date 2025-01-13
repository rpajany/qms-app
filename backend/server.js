import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();



import { saveFileDetailsToDatabase } from './controller/FileUpload_Controller.js';

// routers
import fileRoutes from './routes/fileUpload_route.js';
import userRoutes from './routes/user_route.js';
import masterRoutes from './routes/master_route.js';
import auditDetailRoutes from './routes/auditDetail_route.js';
import auditDataRoutes from './routes/auditData_route.js';

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        callback(null, true); // Allows all origins
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Adjust limit as needed, Parse JSON request bodies
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded request bodies
// app.use(cors());
// app.use(bodyParser.json());

app.use(express.static("uploads"));
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Function to handle dynamic folder upload
const DynamicFolderUpload = (folderName) => {
    console.log('DynamicFolderUpload', folderName); // Log folderName
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const folderPath = `uploads/${folderName}/`;
            fs.mkdirSync(folderPath, { recursive: true });
            cb(null, folderPath);
        },
        filename: (req, file, cb) => {
            const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname)); // Get file name without extension
            cb(null, fileNameWithoutExt + "_" + Date.now() + path.extname(file.originalname)); // Use timestamped filename
        },
    });

    return multer({ storage });
};


app.post("/api/upload", (req, res) => {
    // Log the full query object to debug
    console.log('Full Query Object:', req.query);
    console.log('query Clause', req.query.Clause);
    const { Doc_No, Clause, folderName: DirName } = req.query;
    console.log('All query :', Doc_No, Clause, DirName)

    // Access folderName from query or body (with fallback)
    let folderName = req.query.folderName || req.body.folderName || 'default'; // Fallback to 'default'

    console.log('query', req.query.folderName);
    console.log('params', req.params.folderName);
    console.log('body', req.body.folderName);
    console.log('Folder Name:', folderName);  // Log folderName used for upload

    if (!folderName) {
        return res.status(400).json({ message: "folderName is required" });
    }

    const upload = DynamicFolderUpload(folderName); // Pass folderName to DynamicFolderUpload

    const uploadMiddleware = upload.array("files", 10); // upload.array("files", 10) - Allow up to 10 files

    uploadMiddleware(req, res, (err) => {
        if (err) {
            console.error("Error during file upload:", err);
            return res.status(500).json({ message: "File upload failed.", error: err.message });
        }

        console.log("Files uploaded to folder:", folderName);

        // Save file details to the database
        req.files.forEach(file => {
            const filePath = `uploads/${folderName}/${file.filename}`;
            saveFileDetailsToDatabase(folderName, req.query.Clause, file.filename, filePath);
        });

        res.status(200).json({
            message: "Files uploaded successfully.",
            files: req.files.map((file) => file.filename),
        });
    });
});

// Upload endpoint
// app.post('/upload', upload.array('files'), (req, res) => {
//     console.log("Request Body:", req.body["folderName"]); // Log the body to debug
//     try {
//         res.status(200).json({ message: 'Files uploaded successfully.' });
//     } catch (err) {
//         res.status(500).json({ message: 'Error uploading files.', error: err.message });
//     }
// });

// API Routes
app.use("/api/editUpload", fileRoutes)
app.use("/api/users", userRoutes);  // user api
app.use("/api/master", masterRoutes);  // master api
app.use("/api/auditData", auditDataRoutes);  // master api
app.use("/api/auditDetail", auditDetailRoutes);  // master api

app.listen(port, () =>
    console.log(`server is listening on url http://localhost:${port}`));




