// import React from 'react'
import { GET_Api, POST_Api, Upload_APi, UPDATE_Api, DELETE_Api } from './ApiService';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const AuditService = () => {
    return (
        null
    )
}

export const Get_MasterList = async (dept) => {
    try {
        const result_0 = await GET_Api(`${BASE_URL}/master/getByDept/${dept}`, '');
        console.log('Get_MasterList :', result_0);

        return result_0;
    } catch (error) {

    }

}


export const Load_AuditData_Service = async (dateRange) => {
    try {
        const result_1 = await POST_Api(`${BASE_URL}/auditDetail/load`, ''
            // {
            //     StartDate: dateRange.startDate ? dateRange.startDate : '',
            //     EndDate: dateRange.endDate ? dateRange.endDate : '',
            // }
        );
        console.log('Load_AuditData_Service :', result_1);

        const { data } = result_1;

        return data;

    } catch (error) {
        console.log('Error Load_AuditData_Service : ', error);
        return false;
    }
}

export const Save_AuditService = async (auditData, auditDetail) => {
    try {

        // 1. API Call ...
        const result_2 = await POST_Api(`${BASE_URL}/auditDetail/insert`, '', { AuditDetails: auditDetail });
        console.log('1. Insert Audit_Detail :', result_2.data.id);

        // 2. API Call in loop ...
        for (const item of auditData) {
            const result_3 = await POST_Api(`${BASE_URL}/auditData/insert`, '', { AuditData: item });
            console.log('2. Insert Audit_Data :', result_3.data.id);
        }

        // const result_2 = await POST_Api(`${BASE_URL}/auditData/insert`, '', { AuditData: auditData });
        // console.log('2. Insert Audit_Data :', result_2.data.id);

        // upload files
        for (const item of auditData) {
            try {
                const { Doc_No, Clause, Files } = item;
                const formData = new FormData();
                // formData.append('FolderName', Doc_No);
                // formData.append('Clause', Clause);
                // Array.from(Files).forEach((file) => formData.append("files", file));
                if (Array.isArray(Files)) {
                    Files.forEach(file => {

                        formData.append('files', file); // Ensure 'files' matches the Multer configuration
                    });
                }

                // checkFormDataFiles(formData);

                // 3. API Call in loop ...
                const uploadUrl = `${BASE_URL}/upload?Doc_No=${Doc_No}&folderName=${Doc_No}&Clause=${Clause}`;
                const result_4 = await Upload_APi(uploadUrl, '', formData);

                const { files, message } = result_4.data;

                // console.log(`3. Upload Files :${files} - ${message}`, result_4.data.);
                console.log(`3. Upload Files : ${files} - ${message}`);

            } catch (uploadError) {
                console.error(`Error uploading files for Doc_No ${item.Doc_No}:`, uploadError);
            }

        }


        return true;

    } catch (error) {
        console.log('Error Save_AuditService : ', error);
        return false;
    }

}

export const Delete_AuditService = async (Doc_No) => {
    try {
        // 1. Delete auditDetail
        const response_5 = await DELETE_Api(`${BASE_URL}/auditDetail/delete/${Doc_No}`, '');
        console.log('1. Delete Audit_Detail :', response_5.data.affectedRows);

        // 2. Delete auditdata
        const response_6 = await DELETE_Api(`${BASE_URL}/auditData/delete/${Doc_No}`, '');
        console.log('2. Delete Audit_Data :', response_6.data.affectedRows);

        // 3. Delete upload folder and files
        // const path = `uploads/${Doc_No}`;
        const response_7 = await POST_Api(`${BASE_URL}/editUpload/delete-upload`, '', { folderPath: Doc_No });
        console.log('3. Delete Attachment Folder :', response_7.data.message);

        return true;

    } catch (error) {
        console.log('Error Delete_AuditService : ', error);
        return false;
    }
}


const checkFormDataFiles = (formData) => {
    let hasFiles = false;

    for (let [key, value] of formData.entries()) {

        console.log('key', key)
        console.log('value', value)
        if (value instanceof File) {
            console.log(`File found: Key = ${key}, File Name = ${value.name}`);
            hasFiles = true;
        }
    }

    return hasFiles;
};

// Usage example:
const formData = new FormData();
formData.append('file1', new File(['content'], 'example.txt')); // Adding a file
formData.append('key', 'value'); // Adding a regular key

if (checkFormDataFiles(formData)) {
    console.log('FormData contains files.');
} else {
    console.log('No files in FormData.');
}
