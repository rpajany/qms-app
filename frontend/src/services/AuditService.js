// import React from 'react'
import { GET_Api, POST_Api, Upload_APi, DELETE_Api } from './ApiService';
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
        return result_0.data;

    } catch (error) {
        console.log('Error Get_MasterList : ', error);
        return false;
    }

}


export const Load_AuditData_Service = async (dateRange) => {
    try {
        const result_1 = await POST_Api(`${BASE_URL}/auditDetail/load`, '',
            {
                StartDate: dateRange.startDate ? dateRange.startDate : '',
                EndDate: dateRange.endDate ? dateRange.endDate : '',
            }
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

        console.log('auditData :', auditData)
        console.log('auditDetail :', auditDetail)
        const { Audit_UID } = auditDetail;


        if (!Audit_UID) {
            console.warn("⚠️ Audit_UID is missing in auditDetail, insert operation skipped.");
            return;
        }

        const isValid = auditData.every(item => item.Audit_UID !== undefined && item.Audit_UID !== null);

        if (isValid) {

        } else {
            console.warn("⚠️ One or more items are missing Audit_UID!, insert operation skipped.");

        }

        // if (!Audit_UID) {
        //     console.warn("⚠️ Audit_UID is missing in auditData, insert operation skipped.");
        //     return;
        // }

        // 1. API Call ...
        const result_2 = await POST_Api(`${BASE_URL}/auditDetail/insert`, '', { AuditDetails: auditDetail });
        console.log('1. Insert Audit_Detail :', result_2.data.id);

        // 2. API Call in loop ...
        for (const item of auditData) {
            const result_3 = await POST_Api(`${BASE_URL}/auditData/insert`, '', { AuditData: item });
            console.log('2. Insert Audit_Data :', result_3.data.id);
        }

        // const responses = await Promise.all(
        //     auditData.map(item => POST_Api(`${BASE_URL}/auditData/insert`, '', { AuditData: item }))
        // );
        // responses.forEach((res, index) => console.log(`2. Insert Audit_Data [${index}]:`, res.data.id));



        // const result_2 = await POST_Api(`${BASE_URL}/auditData/insert`, '', { AuditData: auditData });
        // console.log('2. Insert Audit_Data :', result_2.data.id);

        // upload files
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


        return true; // Success

    } catch (error) {
        console.log('Error Save_AuditService : ', error);
        return false;
    }

}

export const Delete_AuditService = async (Audit_UID) => {
    try {

        if (!Audit_UID) {
            console.warn("⚠️ Audit_UID is missing, delete operation skipped.");
            return;
        }

        // 1. Delete auditDetail
        const response_5 = await DELETE_Api(`${BASE_URL}/auditDetail/delete/${Audit_UID}`, '');
        console.log('1. Delete Audit_Detail :', response_5.data.affectedRows);

        // 2. Delete auditdata
        const response_6 = await DELETE_Api(`${BASE_URL}/auditData/delete/${Audit_UID}`, '');
        console.log('2. Delete Audit_Data :', response_6.data.affectedRows);

        // 3. Delete upload folder and files
        // const path = `uploads/${Doc_No}`;
        const response_7 = await POST_Api(`${BASE_URL}/editUpload/delete-upload`, '', { folderPath: Audit_UID });
        console.log(`3. Delete Attachment Folder & tbl_uploads data for Audit_UID=${Audit_UID} `, response_7.data.message);

        return true;

    } catch (error) {
        console.log('Error Delete_AuditService : ', error);
        return false;
    }
}


export const Get_AuditUID_Service = async () => {
    try {
        const response_8 = await GET_Api(`${BASE_URL}/uid/getUID`, '');
        console.log(`Get_AuditUID_Service :' `, response_8);

        // Ensure the response is an array and has at least one element
        if (Array.isArray(response_8) && response_8.length > 0) {
            const { Audit_UID } = response_8[0]; // Access the first element of the array
            console.log('Audit_UID:', Audit_UID);
            return Audit_UID; // Return the extracted UID

        } else {
            throw new Error('Invalid response format or empty array');
        }

    } catch (error) {
        console.log('Error Get_AuditUID_Service : ', error);
        return false;
    }
}

export const Update_AuditUID_Service = async (new_uid) => {
    try {
        const response_9 = await POST_Api(`${BASE_URL}/uid/update`, '', { Audit_UID: new_uid });
        console.log(`Update_AuditUID_Service :' `, response_9);

        return true;

    } catch (error) {
        console.log('Error Update_AuditUID_Service : ', error);
        return false;
    }
}


const checkFormDataFiles = (formData) => {
    let hasFiles = false;

    for (let [key, value] of formData.entries()) {

        // console.log('key', key)
        // console.log('value', value)

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
    // console.log('FormData contains files.');
} else {
    // console.log('No files in FormData.');
}
