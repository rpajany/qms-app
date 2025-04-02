import React from 'react'
import { GET_Api, POST_Api, Upload_APi, DELETE_Api } from './ApiService';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const AuditPlanService = () => {
    return (
        null
    )
}


export const Load_Process_Service = async () => {
    try {
        const result_1 = await GET_Api(`${BASE_URL}/process/load`, '');
        console.log('1. Load_Process_Service :', result_1);
        return result_1;

    } catch (error) {
        console.log('Error Load_Process_Service : ', error);
        return false;
    }
}

export const Load_PlanData_Service = async () => {
    try {
        const result_2 = await GET_Api(`${BASE_URL}/planData/load`, '');
        console.log('2. Load_PlanData_Service :', result_2);
        return result_2;

    } catch (error) {
        console.log('Error Load_PlanData_Service : ', error);
        return false;
    }
}

export const Insert_PlanData_Service = async (planData) => {
    try {
        const result_3 = await POST_Api(`${BASE_URL}/planData/insert`, '', planData);
        console.log('3. Insert_PlanData_Service :', result_3);
        return result_3;  // ✅ Ensure the response is returned

    } catch (error) {
        console.log('Error Insert_PlanData_Service : ', error);
        return {
            success: false,
            message: 'Failed to insert plan data',
            error: error.message
        };
    }
}

export const Update_PlanData_Service = async (planData) => {
    try {

        const results = []; // Store all responses

        for (const item of planData) {
            const result_4 = await POST_Api(`${BASE_URL}/planData/update`, '', item);
            console.log('4. Update_PlanData_Service :', result_4);
            results.push(result_4); // Collect response
        }

        return true;


    } catch (error) {
        console.log('Error Update_PlanData_Service : ', error);
        return {
            success: false,
            message: 'Failed to Update plan data',
            error: error.message
        };
    }
}