import React from 'react';
import { GET_Api, POST_Api, Upload_APi, DELETE_Api, DOWNLOAD_Api } from './ApiService';
import qs from "qs";
import fileDownload from 'js-file-download';// Import qs library for URL-encoding

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export const ViewerService = () => {
    return (
        null
    )
}

export const Viewer_FileDownload_Service = async (file) => {
    try {
        const { Doc_No, File_Name, File_Path } = file;

        console.log('File_Path :', File_Path)

        // Convert data to URL-encoded string
        // const urlEncodedData = qs.stringify(File_Path);
        // const urlEncodedData = encodeURI(File_Path);
        // console.log('urlEncodedData :', urlEncodedData)

        const response = await DOWNLOAD_Api(`${BASE_URL}/editUpload/download`, '', file);

        // const response = await GET_Api(`http://localhost:3001/download`, '',
        //     // const response = await POST_Api(`http://localhost:8081/download`, '',
        //     // { file }, // Send data as JSON
        //     {
        //         responseType: 'blob', // Ensure the response is treated as a Blob
        //         // responseType: 'stream',
        //     }
        // );

        console.log('Viewer_FileDownload_Service response :', response)

        if (!response.ok) {
            throw new Error("Failed to download file.");
        }

        console.log('Viewer_FileDownload_Service response:', response);

        // Convert response data to a Blob
        const blob = new Blob([response.data], { type: response.headers['content-type'] });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary <a> tag
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", File_Name || "downloaded_file"); // Default name if File_Name is empty

        // Append the link to the body and trigger click
        document.body.appendChild(link);
        link.click();

        // Remove the link after the download is triggered
        document.body.removeChild(link);

        // Revoke the temporary URL to free memory
        window.URL.revokeObjectURL(url);

        console.log("File downloaded successfully.");
        return true;



    } catch (error) {
        console.log('Error Viewer_FileDownload_Service : ', error);
        return false;
    }
}


export const FileDownload = async (file) => {
    console.log('FileDownload function...!')
    try {
        const { Doc_No, File_Name, File_Path } = file;

        // const response = await GET_Api(`http://localhost:3001/download`, '');

        // const response = await fetch(`http://localhost:3001/download`);


        const response = await fetch(`${BASE_URL}/editUpload/download`,
            // { file },

            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(file), // Send file as JSON payload
            }
            // {
            //     responseType: "blob", // Important for downloading files
            // }
        );

        // const response = await POST_Api(`${BASE_URL}/editUpload/download`, '',
        //     { file },
        //     {
        //         responseType: "blob", // Important for downloading files
        //     });

        // console.log(response)

        if (!response.ok) {
            throw new Error("Failed to download file.");
        }
        const blob = await response.blob();

        // Create a URL for the file and trigger a download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", File_Name); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();



        window.URL.revokeObjectURL(url);
        console.log("File downloaded successfully.");
        return true;
    } catch (error) {
        console.error("Error in FileDownload function:", error);
    }
}
