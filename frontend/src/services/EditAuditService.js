import React from 'react'
import { GET_Api, POST_Api, Upload_APi, DELETE_Api } from './ApiService';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const EditAuditService = () => {
    return (
        null
    )
}

export const Get_AuditData_Service = async (Audit_UID) => {
    console.log('Audit_UID', Audit_UID)
    try {
        const result_0 = await GET_Api(`${BASE_URL}/auditData/getByUID/${Audit_UID}`, '');
        console.log('Get_AuditData_Service :', result_0);
        return result_0.data;

    } catch (error) {
        console.log('Error Get_AuditData_Service : ', error);
        return false;
    }
}

export const Get_AuditDetail_Service = async (Audit_UID) => {
    try {
        const result_1 = await GET_Api(`${BASE_URL}/auditDetail/getByUID/${Audit_UID}`, '');
        console.log('Get_AuditDetail_Service :', result_1.data[0]);
        return result_1.data[0];


    } catch (error) {
        console.log('Error Get_AuditDetail_Service : ', error);
        return false;
    }
}

export const Update_EditAudit_Service = async (auditDetail, auditData) => {
    try {

        const { Audit_UID } = auditDetail;

        if (!Audit_UID) {
            console.warn("⚠️ Audit_UID is missing, delete operation skipped.");
            return;
        }

        // 1. Delete old auditDetail
        const response_5 = await DELETE_Api(`${BASE_URL}/auditDetail/delete/${Audit_UID}`, '');
        console.log('1. Delete Audit_Detail :', response_5.data.affectedRows);

        // 2. Delete old auditdata
        const response_6 = await DELETE_Api(`${BASE_URL}/auditData/delete/${Audit_UID}`, '');
        console.log('2. Delete Audit_Data :', response_6.data.affectedRows);

        // 3. Delete old upload's in tbl_upload
        // const response_7 = await DELETE_Api(`${BASE_URL}/editUpload/delete_AllUploadData/${Audit_UID}`, '');
        // const response_7 = await POST_Api(`${BASE_URL}/editUpload/delete-upload`, '', { folderPath: Audit_UID });
        // console.log(`3. Delete Attachment Folder & tbl_uploads data for Audit_UID=${Audit_UID} `, response_7.data.message);


        // 1. Save New auditDetail ...
        const result_2 = await POST_Api(`${BASE_URL}/auditDetail/insert`, '', { AuditDetails: auditDetail });
        console.log('1. Insert Audit_Detail :', result_2.data.id);

        // 2. Save New auditData in loop ...
        for (const item of auditData) {
            const result_3 = await POST_Api(`${BASE_URL}/auditData/update`, '', { AuditData: item });
            console.log('2. Insert Audit_Data :', result_3.data.id);
        }

        // const responses = await Promise.all(
        //     auditData.map(item => POST_Api(`${BASE_URL}/auditData/insert`, '', { AuditData: item }))
        // );
        // responses.forEach((res, index) => console.log(`2. Insert Audit_Data [${index}]:`, res.data.id));


        // 3. 

        // upload files is only file is aviable ...
        // for (const item of auditData) {
        //     try {
        //         const { Audit_UID, Clause, Files } = item;

        //         // Check if there are files to upload
        //         if (Array.isArray(Files) && Files.length > 0) {
        //             const formData = new FormData();

        //             // Append files to the form data
        //             Files.forEach(file => {
        //                 formData.append('files', file); // Ensure 'files' matches the Multer configuration
        //             });

        //             // Upload files
        //             const uploadUrl = `${BASE_URL}/upload?Audit_UID=${Audit_UID}&folderName=${Audit_UID}&Clause=${encodeURIComponent(Clause)}`;
        //             const result_4 = await Upload_APi(uploadUrl, '', formData);

        //             const { files, message } = result_4.data;

        //             console.log(`3. Upload Files : ${files} - ${message}`);
        //         } else {
        //             console.log(`No files to upload for Audit_UID : ${Audit_UID}, Clause: ${Clause}`);
        //         }
        //     } catch (error) {
        //         console.error("Error during file upload:", error);
        //     }
        // }
        
        for (const item of auditData) {
            try {
                const { Doc_No, Clause, Files } = item;

                // const formData = new FormData();               
                // if (Array.isArray(Files)) {
                //     Files.forEach(file => {

                //         formData.append('files', file); // Ensure 'files' matches the Multer configuration
                //     });
                // }



                if (!Files || !Array.isArray(Files) || Files.length === 0) {
                    console.warn(`No files to upload for Audit_UID : ${Audit_UID}`);
                    continue; // Skip if no files
                }

                const formData = new FormData();

                // Append files to formData
                Files.forEach(file => {
                    formData.append('files', file); // 'files' must match the backend Multer config
                });

                // checkFormDataFiles(formData);

                // 3. API Call in loop ...
                const uploadUrl = `${BASE_URL}/upload?Audit_UID=${Audit_UID}&folderName=${Audit_UID}&Clause=${encodeURIComponent(Clause)}`;
                const result_4 = await Upload_APi(uploadUrl, '', formData);

                const { files, message } = result_4.data;

                // console.log(`3. Upload Files :${files} - ${message}`, result_4.data.);
                console.log(`3. Upload Files : ${files} - ${message}`);

            } catch (uploadError) {
                console.error(`Error uploading files for Audit_UID ${item.Audit_UID}:`, uploadError);
            }

        }

        return true;

    } catch (error) {
        console.log('Error Save_AuditService : ', error);
        return false;
    }
}

export const Get_UploadFiles_Service = async (Audit_UID) => {
    console.log('Get_UploadFiles_Service called ...')
    try {

        const result_2 = await GET_Api(`${BASE_URL}/editUpload/getByUID/${Audit_UID}`, '');
        console.log('Get_UploadFiles_Service :', result_2.data);
        return result_2.data;

    } catch (error) {
        console.log('Error Get_UploadFiles_Service : ', error);
        return false;
    }
}

// single old file delete ... 
export const Delete_OldUploadFile_Service = async (row) => {
    try {

        const { id, Audit_UID, File_Name, File_Path } = row;

        const result_3 = await POST_Api(`${BASE_URL}/editUpload/deleteByFilePath`, '', {
            id: id, Audit_UID: Audit_UID, FileName: File_Name, FilePath: encodeURIComponent(File_Path)
        });

        console.log('Get_UploadFiles_Service :', result_3.data);
        return result_3.data;

    } catch (error) {
        console.log('Error Delete_OldUploadFile_Service : ', error);
        return false;
    }
}