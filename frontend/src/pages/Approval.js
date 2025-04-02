import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ReactDateRangePicker, DataTableVIew, Modal } from '../components';
import { Load_AuditData_Service } from '../services/AuditService';
import { Update_StatusChange_Service } from '../services/ApprovalService';

import { TbFileExport } from "react-icons/tb";
import { LuView } from "react-icons/lu";
import { MdPreview } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";

// css properties
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
const tbl_header = 'border border-slate-600  bg-gray-500 p-1';
const tbl_thead_tr = " text-white border-r-2  border-gray-300";
const tbl_thead_th = "px-6 py-2 border-r-2  border-gray-300";
const tbl_tbody_td = "border-r-2  border-gray-300 px-1";

export const Approval = () => {
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false); // Track Form submission state
    const [dateRangeNow, setDateRangeNow] = useState({});
    const [gridData, setGridData] = useState([]);

    const [statusModel, setStatusModel] = useState(false);
    const [statusData, setStatusData] = useState([]);


    // const message_InitialData = {
    //     id: '',
    //     Audit_UID: '',
    //     AuditNo: '',
    //     Audit_Date: ''
    // }
    // const [messageData, setMessageData] = useState(message_InitialData);
    // const [showMsgModel, setShowMsgModel] = useState(true);


    const load_Data = async () => {
        try {
            if (dateRangeNow?.startDate && dateRangeNow?.endDate) {
                const outputData = await Load_AuditData_Service(dateRangeNow);
                setGridData(outputData || []);
            }

        } catch (error) {
            console.log('Audit, load_Data Error :', error);
        }
    }

    useEffect(() => {

        load_Data();

    }, [dateRangeNow]);


    const handleView = (row) => {
        navigate("/viewer", { state: row })
    }


    const handle_StatusClick = (row) => {
        console.log('handleStatusClick :', row)
        setStatusModel(true);
        setStatusData((preve) => ({
            ...preve,
            id: row.id,
            Audit_UID: row.Audit_UID,
            Audit_Date: row.Audit_Date,
            Department: row.Department,
            Process: row.Process
        }
        ));
    }


    const handle_StatusChange = (e) => {
        const { name, value } = e.target;
        setStatusData((preve) => ({
            ...preve,
            [name]: value
        }
        ));
    }

    console.log('statusData :', statusData)

    const handel_StatusFormSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true); // Lock the form during submission

        // Ensure Message exists in statusData
        // 1. In JavaScript, statusData.Message ?? "" will check if Message is undefined or null.
        // 2. If Message is missing entirely, it will be treated as undefined, so it assigns an empty string.
        // 3. f Message already exists with a value (e.g., "Some message"), it remains unchanged.
        statusData.Message = statusData.Message ?? "";

        try {
            // console.log('statusData :', statusData)
            const response = await Update_StatusChange_Service(statusData);
            console.log('response', response);

            if (response) {
                // console.log('response', response)

                setStatusModel(false);
                await load_Data();
            }

        } catch (error) {
            console.error("Error StatusFormSubmit :", error); // Handle errors gracefully
            toast.error(error.message);

        } finally {
            setStatusData([])
            setIsSubmitting(false); // Unlock the form
        }


    }

    const handle_ModalClose = () => {
        setStatusModel(false);
        setStatusData([]);

    }

    const handleMessage = (row) => {

    }

    // table column ...
    const columns = [
        {
            name: 'id',
            selector: row => row.id,
            sortable: true
        },
        {
            name: 'Audit_UID',
            selector: row => row.Audit_UID,
            sortable: true
        },
        {
            name: 'Audit_No',
            selector: row => row.AuditNo,
            // cell: row => (
            //   <div title={row.name} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
            //     {row.name}
            //   </div>
            // ),
            sortable: true
        },
        {
            name: 'Audit_Date',
            selector: row => row.Audit_Date,
            sortable: true
        },
        // {
        //     name: 'Rev_No',
        //     selector: row => row.Rev_No,
        //     sortable: true
        // },
        // {
        //     name: 'Rev_Date',
        //     selector: row => row.Rev_Date,
        //     sortable: true
        // },
        {
            name: 'Department',
            selector: row => row.Department,
            sortable: true
        },
        {
            name: 'Auditor',
            selector: row => row.Auditor,
            sortable: true
        },

        {
            name: 'Auditee',
            selector: row => row.Auditee,
            sortable: true
        },
        {
            name: 'Status',
            // selector: row => row.Status,
            selector: row =>
                <span
                    className={`px-2 py-4 text-white rounded-full  cursor-pointer ${row.Status === 'APPROVED' ? 'bg-green-400' :
                        row.Status === 'PENDING' ? 'bg-blue-400' :
                            row.Status === 'REJECTED' ? 'bg-red-400' :
                                // row.Status === 'CANCEL' ? 'bg-yellow-400' :
                                row.Status === 'OPEN' ? 'bg-blue-600' :
                                    'bg-gray-400' // Default color
                        }`}

                    onClick={() => handle_StatusClick(row)}
                >{row.Status}</span>,

            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className='flex p-1 '>
                    <button onClick={() => handleView(row)} className='bg-blue-300 p-2 rounded-sm mr-1'><span><LuView /></span></button>
                    {/* <button onClick={() => handleMessage(row)} className='bg-blue-300 p-2 rounded-sm mr-1'><span><MdOutlineMessage /></span></button> */}

                    {/* <button onClick={() => handleExport(row)} className='bg-green-400 p-2 rounded-sm mr-1'><span><TbFileExport /></span></button> */}
                    {/* <button onClick={() => handleEdit(row)} className='bg-yellow-300 p-2 rounded-sm mr-1'><span><FaEdit /></span></button> */}

                    {/* <button onClick={() => handleDelete(row)} className='bg-red-500 p-2 rounded-sm'><RiDeleteBin2Line /></button> */}
                </div>
            ),
            ignoreRowClick: true, // Prevent triggering row click event when clicking buttons
            allowoverflow: true, // Ensure the buttons are visible - "allowOverflow"
            // button: true, // Makes it clear they are buttons
        }
    ]

    return (
        <>
            <div className='h-screen p-4 bg-green-100 rounded-lg'>
                {/*  Content for Tab 1  */}
                <div className='flex mb-4'>

                    <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
                </div>

                <Modal isVisible={statusModel} onClose={() => handle_ModalClose()}>
                    <div className='border-2 border-white   bg-gray-300 w-80'>
                        <div className='flex flex-row bg-blue-400 text-white      '>
                            <h2 className=' px-3 py-2 '>Update Audit Status</h2>
                            <button onClick={handle_ModalClose} className='ml-auto pr-2  w-5 h-5  hover:cursor-pointer'><span className='text-gray-500'>&times;</span></button>
                        </div>

                        <div className='mt-4 px-4'>
                            <form onSubmit={handel_StatusFormSubmit}>


                                <div className='mt-4 mb-4'>
                                    <label htmlFor='Audit_UID' className={`${label_css}`}>Audit_UID</label>
                                    <input type="text"
                                        id="Audit_UID"
                                        name="Audit_UID"
                                        value={statusData.Audit_UID}
                                        required
                                        readOnly
                                        className={`${input_css} w-1/4`}
                                    />
                                </div>

                                <label htmlFor="Status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Change Status</label>
                                <select
                                    id="Status"
                                    name="Status"
                                    onChange={(e) => handle_StatusChange(e)}
                                    value={statusData.Status}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                    <option value="">- Select -</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="REJECTED">REJECTED</option>


                                </select>

                                <div className='mt-4 mb-4'>
                                    <label htmlFor='Message' className={`${label_css}`}>Message</label>
                                    {/* <input type="text"
                                        id="Message"
                                        name="Message"
                                        onChange={(e) => handle_StatusChange(e)}
                                        value={statusData.Message}
                                        className={`${input_css} w-1/4`}
                                    /> */}
                                    <textarea
                                        id="Message"
                                        name="Message"
                                        onChange={(e) => handle_StatusChange(e)}
                                        value={statusData.Message}
                                        rows={5}
                                        className={`${input_css} w-1/4`}
                                    >

                                    </textarea>
                                </div>

                                {statusData.Status === 'APPROVED' && (
                                    <div className='mt-4 mb-4'>
                                        <label htmlFor='ReviewedBy' className={`${label_css}`}>Reviewed By</label>
                                        <input type="text"
                                            id="ReviewedBy"
                                            name="ReviewedBy"
                                            onChange={(e) => handle_StatusChange(e)}
                                            value={statusData.ReviewedBy}
                                            required
                                            className={`${input_css} w-1/4`}
                                        />
                                    </div>
                                )}


                                <button type="submit"
                                    disabled={isSubmitting}
                                    className={`${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer'} mt-4 focus:outline-none text-white bg-yellow-400 hover:bg-yellow-300 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900`}>Update</button>
                            </form>
                        </div>
                    </div>
                </Modal>

                {/* {showMsgModel && (
                    <div className='w-full flex fixed inset-0 items-center justify-center bg-black bg-opacity-80 z-50'>
                        <div className='w-80 border-2 border-white   bg-gray-300  rounded-md '>
                            <div className='flex flex-row bg-blue-400 text-white      '>
                                <h2 className=' px-3 py-2 '>Audit Message</h2>
                                <button onClick={() => setShowMsgModel(!showMsgModel)} className='ml-auto pr-2  w-5 h-5  hover:cursor-pointer'><span className='text-gray-500'>&times;</span></button>
                            </div>

                            <div>
                                <div className='mt-4 mb-4'>
                                    <label htmlFor='Audit_UID'>Audit_UID</label>
                                    <input type="text"
                                        id="Audit_UID"
                                        name="Audit_UID"
                                        value={statusData.Audit_UID}
                                        required
                                        readOnly
                                        className={`${input_css} w-1/4`}
                                    />
                                </div>


                            </div>
                        </div>

                    </div>
                )} */}

                <DataTableVIew tbl_title={''} columns={columns} apiData={gridData} />
            </div>
        </>
    )
}
