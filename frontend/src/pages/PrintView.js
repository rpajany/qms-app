// https://chatgpt.com/share/6793729a-ec08-8007-b1fb-210d835015b6

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import { Get_AuditData_Service, Get_AuditDetail_Service, Get_UploadFiles_Service } from '../services/EditAuditService';
import { PdfGenerator } from './PdfGenerator';

import Logo from '../assets/INEL_logo_1.png'
// css properties
const label_css = 'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
const input_css = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
// const tbl_header = 'border border-slate-600  bg-gray-500 p-1';
const tbl_header = 'bg-gray-500';
const tbl_thead_tr = " text-white border-r-2  border-gray-300";
const tbl_thead_th = "z-20 sticky top-0 border-r-2 border border-gray-300 px-6 py-2 bg-gray-500";
const tbl_tbody_td = "border-r-2  border-gray-300 px-1";


// Create styles for the PDF document
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
        fontSize: 12,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export const PrintView = () => {
    const location = useLocation();
    const edit_row = location.state;
    const { id, Doc_No, Department, Audit_Date, } = edit_row; // destructure
    const [loading, setLoading] = useState(false);

    const n = 30;

    const auditDetail_InitialValue = {
        id: '',
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
    }

    const [auditDetail, setAuditDetail] = useState(auditDetail_InitialValue);
    const [auditData, setAuditData] = useState([]);

    // get auditData ...
    const Get_AuditData = async (doc_no) => {
        try {
            const result_0 = Array.isArray(await Get_AuditData_Service(doc_no))
                ? await Get_AuditData_Service(doc_no)
                : [];

            // console.log('result_0', result_0)
            setAuditData(result_0);

        } catch (error) {
            console.log('Error :', error)
        }

    }

    // get auditDetails ...
    const Get_AuditDetail = async (doc_no) => {
        try {
            const result_1 = (await Get_AuditDetail_Service(doc_no))
                ? await Get_AuditDetail_Service(doc_no) : {};
            // console.log('result_1', result_1);

            setAuditDetail((preve) => ({
                ...preve,
                ...result_1
            }));

        } catch (error) {
            console.log('Error :', error)
        }

    }

    useEffect(() => {

        const fetchData = async () => {
            await Get_AuditData(Doc_No); // Wait until auditData is fetched
            await Get_AuditDetail(Doc_No); // Wait until auditDetail is fetched
            // await Get_UploadFiles(Doc_No); // Then, get upload files
        };

        fetchData();

    }, [Doc_No])

    console.log('auditData', auditData)
    console.log('auditDetail', auditDetail)


    // Sample data
    const sampleData = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Name ${index + 1}`,
        age: Math.floor(Math.random() * 60) + 18,
    }));


    return (
        <>


            <div className='border border-gray-400  '  >
                <div className='grid grid-cols-3  border-b'>
                    <div className=' flex border-r px-4  py-2   items-center'>
                        <img src={Logo} alt='logo' height={'10%'} width={'10%'} className='mr-4' />
                        <span>INDIA NIPPON ELECTRICAL LTD</span>
                    </div>
                    <div className='flex items-center justify-center border-r'>
                        <span className='text-center font-bold'>QMS - AUDIT CHECK LIST</span>
                    </div>
                    <div className='flex flex-col'>
                        <div className='border-b px-2'>Doc_No. : <span className='ml-2'>{auditDetail.Doc_No}</span></div>
                        <div className='border-b px-2'>Audit Date : <span className='ml-2'>{auditDetail.Audit_Date}</span></div>
                        <div className='px-2'>Audit Date : <span className='ml-2'>{auditDetail.Audit_Date}</span></div>
                    </div>
                </div>
                <div className='  '>
                    <div className='grid grid-cols-4  ' >
                        <div className=' border-r px-2'>Auditor :<span className='ml-2'>{auditDetail.Auditor}</span></div>
                        <div className='border-r  px-2'>Ref.No :<span className='ml-2'>{auditDetail.Rev_No}</span></div>
                        <div className='border-r px-2'>Rev_Date :<span className='ml-2'>{auditDetail.Rev_Date}</span></div>
                        <div className='   px-2'>Department :<span className='ml-2'>{auditDetail.Department}</span></div>

                    </div>
                    <div className='grid grid-cols-4 border-t border-b'>
                        <div className=' border-r px-2'>Auditee :<span className='ml-2'>{auditDetail.Auditee}</span></div>
                        <div className=' border-r px-2'>Process :<span className='ml-2'>{auditDetail.Process}</span></div>
                    </div>
                </div>

                <div className='  border-b mt-2 px-2 mb-2'>
                    <table className='w-full table-auto border-collapse  '>
                        <thead className={tbl_header}>
                            <tr className={tbl_thead_tr}>
                                <th className={`${tbl_thead_th} `}>#</th>
                                <th className={`${tbl_thead_th} `}>Clause</th>
                                <th className={`${tbl_thead_th} w-1/4 `}>CheckPoints</th>
                                <th className={`${tbl_thead_th}  w-1/2`}>Guidelines</th>
                                <th className={`${tbl_thead_th} w-1/2`}>Observation</th>
                                <th className={`${tbl_thead_th} `}>Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {/* {auditData && auditData.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-gray-100 border-b border-l border-r" : "border-l border-r border-b"}>
                                    <td className='border-r   p-1 text-center'>{index + 1}</td>
                                    <td className='  border-r p-1 text-center'>{item.Clause}</td>
                                    <td className='border-r px-2'>{item.Check_Points}</td>
                                    <td className='border-r px-2'>{item.Guide_Lines}</td>
                                    <td className='border-r px-2'>{item.Observation}</td>
                                    <td className='px-2 text-center'>{item.Status}</td>
                                </tr>
                            ))

                            } */}

                            {
                                [...Array(n)].map((e, i) => (

                                    <tr key={i} className={i % 2 === 0 ? "bg-gray-100 border-b border-l border-r" : "border-l border-r border-b"}>
                                        <td className='border-r   p-1 text-center'>{i + 1}</td>
                                        <td className='  border-r p-1 text-center'>{4.1}</td>
                                        <td className='border-r px-2'>Supplier evaluation - for all suppliers for product realization- including packing materials </td>
                                        <td className='border-r px-2'>Verify how the supplier development is carried out like- supplier process, product audits, training programmes, meets etc and their status of implementation of QMS ISO 9001 / IATF 16949 : 2016</td>
                                        <td className='border-r px-2'>Verify the applicable statutory and regulatory requirments for all externaly provided products and oursourcexd products for conformances</td>
                                        <td className='px-2 text-center'>Q+</td>
                                    </tr>
                                ))

                            }



                        </tbody>

                    </table>
                </div>
            </div>
            {/* <PdfGenerator auditData={auditData} auditDetail={auditDetail} Logo={Logo} /> */}
        </>
    )
}
