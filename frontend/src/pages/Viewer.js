import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Get_AuditData_Service, Get_AuditDetail_Service, Get_UploadFiles_Service } from '../services/EditAuditService';
import { Viewer_FileDownload_Service, FileDownload } from '../services/ViewerService';
import { LoadSpinner } from '../components';
import { ImageViewer } from '../components/ImageViewer';


import { IoMdDownload } from "react-icons/io";

// css properties
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
// const tbl_header = 'border border-slate-600  bg-gray-500 p-1';
const tbl_header = 'bg-gray-500';
const tbl_thead_tr = " text-white border-r-2  border-gray-300";
const tbl_thead_th = "z-20 sticky top-0 border border-gray-300 px-6 py-2 bg-gray-500";
const tbl_tbody_td = "border-r-2  border-gray-300 px-1";

export const Viewer = () => {
    const location = useLocation();
    const edit_row = location.state;
    const { id, Audit_UID, Department, Audit_Date, } = edit_row; // destructure

    const auditDetail_InitialValue = {
        id: '',
        Audit_UID: '',
        AuditNo: '',
        Year: '',
        Doc_No: '',
        Rev_No: '',
        Rev_Date: '',
        Auditor: '',
        RefNo: '',
        Department: '',
        Auditee: '',
        Process: '',
        Audit_Date: '',
        Shift: '',
        Plant: '',
        Status: '',
        ReviewedBy: ''
    }

    const [auditDetail, setAuditDetail] = useState(auditDetail_InitialValue);
    const [auditData, setAuditData] = useState([]);

    const [imageData, setImageData] = useState('');
    const [showImgModel, setShowImgModel] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // get auditData ...
    const Get_AuditData = async (Audit_UID) => {
        try {
            const result_0 = Array.isArray(await Get_AuditData_Service(Audit_UID))
                ? await Get_AuditData_Service(Audit_UID)
                : [];

            // console.log('result_0', result_0)
            setAuditData(result_0);

        } catch (error) {
            console.log('Error :', error)
        }

    }

    // get auditDetails ...
    const Get_AuditDetail = async (Audit_UID) => {
        try {
            const result_1 = (await Get_AuditDetail_Service(Audit_UID))
                ? await Get_AuditDetail_Service(Audit_UID) : {};
            // console.log('result_1', result_1);

            setAuditDetail((preve) => ({
                ...preve,
                ...result_1
            }));

        } catch (error) {
            console.log('Error :', error)
        }

    }

    // get upload files ...
    const Get_UploadFiles = async (Audit_UID) => {
        try {
            const result = await Get_UploadFiles_Service(Audit_UID);
            console.log("Result from API:", result);
            // console.log('typeof :', typeof (auditData))
            // console.log('typeof result:', typeof (result))

            setAuditData((prev) => {

                console.log("Previous auditData:", prev);

                // Ensure `prev` is an array
                if (!Array.isArray(prev)) {
                    console.error("auditData is not an array:", prev);
                    return prev;
                }

                // Map through `prev` to create a new array with updates
                const updatedAuditData = prev.map((entry) => {
                    // Find items in `result` that match `entry.Doc_No`
                    const matchingUploads = result.filter(
                        (item) => item.Clause === entry.Clause // check Clause is ===
                    );

                    // Add `Uploads` to the matching entry, leave others unchanged
                    return {
                        ...entry,
                        Uploads: matchingUploads.length > 0 ? matchingUploads : entry.Uploads || null, // Add `Uploads` or keep it as `null`
                    };
                });

                console.log("Updated auditData:", updatedAuditData);
                return updatedAuditData; // Return the updated array
            });


        } catch (error) {
            console.log('Failed to fetch upload files :', error)
        }

    }


    useEffect(() => {

        const fetchData = async () => {
            try {
                setIsLoading(true);
                await Get_AuditData(Audit_UID); // Wait until auditData is fetched
                await Get_AuditDetail(Audit_UID); // Wait until auditDetail is fetched
                await Get_UploadFiles(Audit_UID); // Then, get upload files
            } catch (error) {
                console.log('Error Viewer fetchData :', error)
            } finally {
                setIsLoading(false);
            }

        };

        fetchData();

    }, [Audit_UID])

    console.log('auditData', auditData)
    console.log('auditDetail', auditDetail)
    console.log('imageData :', imageData)


    const handleDownload = async (file) => {
        try {
            console.log('file :', file)
            // const { File_Path } = file;
            // console.log('File_Path :', File_Path)
            // const result = await Viewer_FileDownload_Service(file);

            const result = await FileDownload(file);

        } catch (error) {
            console.log('Failed to Download file :', error)
        }

    }


    const handle_ImageClick = (item) => {
        setImageData(item);
        setShowImgModel(true);
    }

    return (
        <div>
            {/* Loading Spinner */}
            {isLoading && <LoadSpinner isLoading={isLoading} />}

            <div className='bg-blue-200 text-black py-2 px-4 '>
                <span>Audit Viewer</span>
            </div>

            <div className='grid grid-rows-2 mt-4 border  '>
                <div className=' border-b grid grid-cols-6 bg-cyan-500 text-white   rounded-t-md justify-between   '>
                    <div className='border-r p-2    '><span>Doc No : {auditDetail.Doc_No}</span></div>
                    <div className='border-r p-2   '>Audit Date : {auditDetail.Audit_Date}</div>
                    <div className='border-r p-2 '>Rev_No : {auditDetail.Rev_No}</div>
                    <div className='border-r p-2 '>Rev_Date : {auditDetail.Rev_Date}</div>
                    <div className='border-r p-2 '>Year : {auditDetail.Year}</div>
                    {/*<div className='border-r p-2 '>RefNo : {auditDetail.RefNo}</div> */}
                    <div className='border-r p-2 '>Shift : {auditDetail.Shift}</div>

                </div>

                <div className=' grid grid-cols-6   bg-cyan-500 text-white  justify-between  '>
                    <div className='border-r  p-2     '>Auditor : {auditDetail.Auditor}</div>
                    <div className='border-r p-2 '>Auditee : {auditDetail.Auditee}</div>
                    <div className='border-r px-2 '>
                        <label className='block'>Department : </label>
                        {auditDetail.Department}
                    </div>
                    <div className='border-r px-2 '>
                        <label className='block'>Process : </label>
                        {auditDetail.Process}
                    </div>
                    <div className='border-r p-2 '>Status : {auditDetail.Status}</div>
                    <div className='border-r p-2 '>Plant : {auditDetail.Plant}</div>
                </div>

            </div>

            <div className="max-h-full   mt-1 overflow-y-auto border border-gray-300 rounded-md">
                <table className='w-full table-auto border-collapse  '>
                    <thead className={tbl_header}>
                        <tr className={tbl_thead_tr}>
                            <th className={`${tbl_thead_th} `}>#</th>
                            <th className={`${tbl_thead_th} `}>Clause</th>
                            <th className={`${tbl_thead_th} w-1/4 `}>Check Points</th>
                            <th className={`${tbl_thead_th}  w-1/2`}>Guidelines</th>
                            <th className={`${tbl_thead_th} w-1/2`}>Observation</th>
                            <th className={`${tbl_thead_th} `}>Status</th>
                            <th className={`${tbl_thead_th} `}>Files</th>
                            <th className={`${tbl_thead_th} w-20`}>Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditData && auditData.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <td className='border border-slate-600 p-1 text-center'>{index + 1}</td>
                                <td className='border border-slate-600 p-1 text-center'>{item.Clause}</td>
                                <td className='border border-slate-600 p-2'><div className='text-balance'>{item.Check_Points}</div></td>
                                <td className='border border-slate-600 p-2'>
                                    <div className=' '> {item.Guide_Lines}</div>

                                    {/* <textarea
                                        id={`Observation-${item.id}`}
                                        name={`Observation`}
                                        onChange={(e) => auditData_handleChange(e, item)}
                                        value={item.Observation || ""}
                                        rows="4" cols="30"
                                        placeholder='Enter Observation ....'
                                        className={`${''} p-1 border-2 border-yellow-300 mt-2 focus:border-2 focus:border-green-300`}></textarea> */}
                                </td>


                                <td className='border border-slate-600 p-2'>{item.Observation || ""}</td>

                                {/* <td className='border border-slate-600 p-1'>
                      <textarea
                        id={`Observation-${item.id}`}
                        name={`Observation`}
                        onChange={(e) => auditData_handleChange(e, item)}
                        value={item.Observation || ""}
                        rows="4" cols="30"
                        className={`${input_css}`}></textarea>
                    </td> */}
                                <td className='border border-slate-600 p-1 items-center text-center'>
                                    {/* <RadioButton title="" selectedOption={statusOption} setSelectedOption={setStatusOption} dataArray={staus_Array} /> */}
                                    {/* Radio buttons for Status */}
                                    {/* <div className="flex flex-row items-center text-center m-1"> */}
                                    {/* 
                                        <label htmlFor={`Status-O+-${item.id}`} style={{ margin: '0px 5px' }}>
                                            {item.Status}
                                        </label> */}

                                    <span className={`text-white px-2 py-2 w-10 h-10 rounded-md items-centertext-center ${item.Status === 'O+' ? 'bg-green-700'
                                        : item.Status === 'OI' ? 'bg-yellow-400 px-3'
                                            : item.Status === 'NC' ? 'bg-red-500' : ''}`}>
                                        {item.Status}
                                    </span>

                                    {/* </div> */}
                                </td>
                                <td className='border border-slate-600 p-1'>
                                    {/* <input
                                        type="file"
                                        id={`Files-${item.id}`}
                                        name="Files"
                                        multiple // Allow multiple file selection
                                        onChange={(e) => auditData_handleChange(e, item)}
                                        className={`w-40`}
                                    /> */}

                                    {/* Display Newly uploaded file names with remove buttons */}
                                    {item.Files && item.Files.length > 0 && (
                                        <ul className="mt-2">
                                            {item.Files.map((file, fileIndex) => (
                                                <li key={fileIndex} className="relative text-sm bg-green-600 p-1 mb-1 text-white  rounded justify-between items-center m-0">
                                                    <span>{file.name}</span>
                                                    {/* <button
                                                        type="button"
                                                        className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                                        onClick={() => removeFile(item.id, fileIndex)}
                                                    >
                                                        X
                                                    </button> */}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Display Old uploaded file names with remove buttons */}
                                    {item.Uploads && item.Uploads.length > 0 && (
                                        <ul className="mt-2">
                                            {item.Uploads.map((file, fileIndex) => (
                                                <li key={fileIndex} className="relative text-sm bg-gray-600 p-1 mb-1 text-white  rounded justify-between items-center m-0">
                                                    <span>{file.File_Name}</span>
                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-2 text-green-500 text-lg ml-2"
                                                        onClick={() => handleDownload(file)}
                                                    >
                                                        <IoMdDownload />
                                                    </button>
                                                    {/* <span className='absolute top-1 right-8 w-5 h-5 bg-red-400 rounded-full text-white text-sm text-center'>1</span> */}
                                                </li>

                                            ))}
                                        </ul>
                                    )}
                                </td>
                                <td className='  border border-slate-600 p-1 w-3/4     items-center'>
                                    {/* <button
                                        type="button"
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                        onClick={() => startCamera(item.id)}
                                    >
                                        Take Photo
                                    </button> */}

                                    {item && item.Images !== "" ?
                                        <ul className="mt-1 flex flex-col items-center">
                                            <li className="relative text-sm flex items-center m-0">
                                                <img
                                                    src={item.Images}
                                                    alt={`Captured-1`}
                                                    className="w-40 h-20 border m-0"
                                                    onClick={() => handle_ImageClick({ Audit_UID: item.Audit_UID, Clause: item.Clause, Img_No: 1, ImgSrc: item.Images })}
                                                />
                                                {/* <button
                                                    type="button"
                                                    className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                                    onClick={() => removeImageFromAuditData(item.id)}
                                                >
                                                    X
                                                </button> */}

                                                <span className='absolute w-5 h-5 bg-white  top-1 left-2   text-red-500 text-sm text-center'>1</span>
                                            </li>

                                            {item && item.Images_2 !== "" ?
                                                <li className="relative text-sm flex items-center m-0 mt-1">
                                                    <img
                                                        src={item.Images_2}
                                                        alt={`Captured-2`}
                                                        className="w-40 h-20 border m-0"
                                                        onClick={() => handle_ImageClick({ Audit_UID: item.Audit_UID, Clause: item.Clause, Img_No: 2, ImgSrc: item.Images_2 })}
                                                    />
                                                    {/* <button
                                                    type="button"
                                                    className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                                    onClick={() => removeImageFromAuditData(item.id)}
                                                >
                                                    X
                                                </button> */}
                                                    <span className='absolute w-5 h-5 bg-white  top-1 left-2   text-red-500 text-sm text-center'>2</span>
                                                </li> : ''
                                            }

                                            {item && item.Images_3 !== "" ?
                                                <li className="relative text-sm flex items-center m-0 mt-1">
                                                    <img
                                                        src={item.Images_3}
                                                        alt={`Captured-3`}
                                                        className="w-40 h-20 border m-0"
                                                        onClick={() => handle_ImageClick({ Audit_UID: item.Audit_UID, Clause: item.Clause, Img_No: 3, ImgSrc: item.Images_3 })}
                                                    />
                                                    {/* <button
                                                    type="button"
                                                    className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                                    onClick={() => removeImageFromAuditData(item.id)}
                                                >
                                                    X
                                                </button> */}
                                                    <span className='absolute w-5 h-5 bg-white  top-1 left-2   text-red-500 text-sm text-center'>3</span>
                                                </li> : ''
                                            }

                                        </ul>
                                        : ''
                                    }



                                    {console.log('item', item)}




                                    {/* {item.Images && item.Images.length > 0 && (
                            <ul className="mt-2 flex flex-col items-center">
                              {item.Images.map((image, imgIndex) => (
                                <li key={imgIndex} className="relative text-sm flex items-center m-0">
                                  <img
                                    src={image}
                                    alt={`Captured-${imgIndex}`}
                                    className="w-40 h-20 border m-0"
                                  />

                                  <button
                                    type="button"
                                    
                                    className="absolute top-1 right-2 text-red-500 text-xs ml-2"
                                    onClick={() => removeImageFromAuditData(item.id, imgIndex)}
                                  >
                                    X
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )} */}

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {imageData && (
                <ImageViewer imageSrc={imageData} showImgModel={showImgModel} setShowImgModel={setShowImgModel} />
            )}

        </div>
    )
}
