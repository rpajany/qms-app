import express from 'express';
// file upload functionality
// import fileUpload from "express-fileupload";
import https from 'https';

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
import uidRoutes from './routes/uid_route.js';
import userRoutes from './routes/user_route.js';
import masterRoutes from './routes/master_route.js';
import processRoutes from './routes/process_route.js';
import planDataRoutes from './routes/planData_route.js';
import auditDetailRoutes from './routes/auditDetail_route.js';
import auditDataRoutes from './routes/auditData_route.js';
import departmentRoutes from './routes/department_route.js';
import msgRoutes from './routes/msg_route.js';
import authRoutes from './routes/auth_route.js';

const port = process.env.PORT || 8080; // "8443"
const app = express();

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(process.cwd(), 'build')));

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        callback(null, true); // Allows all origins
    },
    credentials: true
}));

// Passing fileUpload as a middleware
// app.use(fileUpload());

app.use(express.json({ limit: '50mb' })); // Adjust limit as needed, Parse JSON request bodies
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded request bodies
// app.use(cors());
// app.use(bodyParser.json());

app.use(express.static("uploads"));
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Function to handle dynamic folder upload
const DynamicFolderUpload = (folderName) => {
    // console.log('DynamicFolderUpload', folderName); // Log folderName
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

    // req.on('data', chunk => console.log('Chunk received:', chunk.toString()));
    // req.on('end', () => console.log('Request upload complete.'));
    // console.log('Files received:', req.files);




    // const { Audit_UID, Clause, folderName: DirName } = req.query;
    const { Audit_UID, Clause, folderName: DirName } = req.query;
    // console.log('query Clause', req.query.Clause);
    const decodedClause = decodeURIComponent(Clause);
    // console.log('Full Query Object:', req.query);
    // console.log('query Clause', req.query.Clause);
    // console.log('All query :', Clause, DirName)

    // Access folderName from query or body (with fallback)
    // let folderName = req.query.folderName || req.body.folderName || 'default'; // Fallback to 'default'
    let folderName = DirName || 'default'; // Fallback to 'default'

    // console.log('query', req.query.folderName);
    // console.log('params', req.params.folderName);
    // console.log('body', req.body);
    // console.log('Folder Name:', folderName);  // Log folderName used for upload

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

        // console.log("Files uploaded to folder:", folderName);

        // Save file details to the database
        req.files.forEach(file => {
            const filePath = `uploads/${folderName}/${file.filename}`;
            saveFileDetailsToDatabase(Audit_UID, decodedClause, file.filename, filePath);
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
app.use("/api/uid", uidRoutes);  // user api
app.use("/api/users", userRoutes);  // user api
app.use("/api/master", masterRoutes);  // master api
app.use("/api/process", processRoutes);  // master api
app.use("/api/planData", planDataRoutes);  // master api
app.use("/api/auditData", auditDataRoutes);  // master api
app.use("/api/auditDetail", auditDetailRoutes);  // master api
app.use("/api/department", departmentRoutes);  // master api
app.use("/api/msg", msgRoutes);  // master api
app.use("/api/auth", authRoutes);

// app.get("/api/download", function (req, res) {
//     console.log('download function called !!!',)
//     // The res.download() talking file path to be downloaded
//     res.download(__dirname + "/uploads/1/Ashwanth Akshaya_1737361691071.pdf", function (err) {
//         if (err) {
//             console.log(err);
//         }
//     });
// });



// Catch-all route for React
app.get('*', (req, res) => {
    // res.sendFile(path.join(__dirname, 'build', 'index.html'));
    res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
});





// nginx ssl ...
// const options = {
//   key: fs.readFileSync("C:/nginx/ssl/server.key"),
//   cert: fs.readFileSync("C:/nginx/ssl/server.crt")
// };


// apache ssl ...
// const options = {
//     key: fs.readFileSync('C:/xampp/apache/conf/ssl/server.key'),
//     cert: fs.readFileSync('C:/xampp/apache/conf/ssl/server.crt')
// };

// https.createServer(options, app).listen(port, () => { // 8080
//     console.log(`HTTPS Server running on port ${port}`); // 8080
// });


app.listen(port, '0.0.0.0', () =>
    console.log(`server is listening on url http://localhost:${port}`));