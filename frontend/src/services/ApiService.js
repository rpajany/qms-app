// https://chatgpt.com/c/6778b704-8608-8007-a3f3-ef4e1e150756

// import React from 'react'
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const ApiService = () => {

    return (
        null
    )
}

// Create api (POST)
// export const POST_Api = async (API_URL, token = '', data) => {
//     try {
//         const Post_ApiResponse = await axios.post(API_URL, data,
//             {
//                 headers: {

//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//             });

//         return Post_ApiResponse;



//     } catch (error) {
//         console.error(`Error POST_Api Response for ${API_URL}:`, error.message);
//         throw error; // Re-throw the error for the caller to handle
//     }
// };


// Create a reusable Axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL, //"https://192.168.1.10:8080", // Update with your local API URL
    headers: {
        "Content-Type": "application/json",
    },
});


export const POST_Api = async (API_URL, token = '', data) => {
    try {
        // Determine Content-Type based on the data type
        const headers = {
            "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
        };

        // Add Authorization header if token is provided
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const Post_ApiResponse = await axios.post(API_URL, data, { headers });
        return Post_ApiResponse;
    } catch (error) {
        console.error(`Error POST_Api Response for ${API_URL}:`, error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};

// GET api (GET)
export const GET_Api = async (API_URL, token = '', config) => {
    try {
        const Get_ApiResponse = await axios.get(API_URL, token, config);
        // console.log('GET ApiResponse :', Get_ApiResponse.data)
        return Get_ApiResponse.data;
    } catch (error) {
        console.error('Error GET_Api Response :', error);
    }
};

// Update api (PUT)
export const UPDATE_Api = async (API_URL, token = '', updatedData) => {
    try {
        const Put_ApiResponse = await axios.put(API_URL, updatedData);
        console.log('PUT ApiResponse :', Put_ApiResponse.data)
        return Put_ApiResponse.data;
    } catch (error) {
        console.error('Error PUT_Api Response :', error);
    }
};

// Delete api (DELETE)
export const DELETE_Api = async (API_URL, token = '') => {
    try {
        const config = {
            headers: {},
        };

        // Include Authorization header if token is provided
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Make the DELETE request
        const response = await axios.delete(API_URL, config);
        console.log('DELETE ApiResponse :', response.data)
        return response;

    } catch (error) {
        console.error('Error DELETE_Api Response :', error);
        // Optionally rethrow the error or return a custom error object
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete',
        };
    }
};

// upload file
export const Upload_APi = async (API_URL, token = '', formData) => {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                // ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        return response;
    } catch (error) {
        console.error('Error in Upload_APi:', error);
        throw error; // Ensure the calling function is aware of the error
    }
}

// Correct POST_Api to handle file download
export const DOWNLOAD_Api = async (API_URL, token = '', data) => {
    try {
        // Determine Content-Type based on the data type
        const headers = {
            "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
        };

        // Add Authorization header if token is provided
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Configure Axios to handle binary data
        const Post_ApiResponse = await axios.post(API_URL, data, {
            headers,
            responseType: 'blob', // Important for downloading files
        });
        return Post_ApiResponse;
    } catch (error) {
        console.error(`Error POST_Api Response for ${API_URL}:`, error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};
