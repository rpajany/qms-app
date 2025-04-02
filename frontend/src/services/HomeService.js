import React from 'react';
import { GET_Api, POST_Api, Upload_APi, DELETE_Api } from './ApiService';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const HomeService = () => {
    return (
        null
    )
}

// load DashBoard Data
export const Load_DashBoard_Service = async (dateRangeNow) => {
    console.log('Load_DashBoard_Service dateRangeNow :', dateRangeNow)
    try {
        const result_0 = await POST_Api(`${BASE_URL}/auditDetail/dashBoardData`, '', { dateRangeNow });
        console.log('Load_DashBoard_Service :', result_0.data);
        return result_0.data;

    } catch (error) {
        console.log('Error Load_DashBoard_Service :', error)
    }
}

// load Audit Plan Data
export const Load_AuditPlan_Service = async () => {
    try {
        const result_1 = await GET_Api(`${BASE_URL}/planData/load`, '');
        console.log('2. Load_AuditPlan_Service  :', result_1);
        return result_1;  // ✅ Ensure the response is returned

    } catch (error) {
        console.log('Error Load_AuditPlan_Service : ', error);
        return {
            success: false,
            message: 'Failed to Load_AuditPlan data',
            error: error.message
        };
    }
}