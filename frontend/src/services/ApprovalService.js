import React from 'react';
import { GET_Api, POST_Api, Upload_APi, DELETE_Api } from './ApiService';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const ApprovalService = () => {
    return (
        null
    )
}

export const Update_StatusChange_Service = async (statusData) => {
    try {

        const result_1 = await POST_Api(`${BASE_URL}/auditDetail/updateStatus`, '', { statusData });
        console.log('1. Update_StatusChange_Service :', result_1);

        const { Audit_UID, Message } = statusData;

        if (Message !== "") {
            const result_2 = await POST_Api(`${BASE_URL}/msg/insert`, '', { Audit_UID, Message });
            console.log('2. Msg_Insert_Service :', result_2);
        }


        return result_1.data;

    } catch (error) {
        console.log('Error Update_StatusChange_Service : ', error);
        return false;
    }
}