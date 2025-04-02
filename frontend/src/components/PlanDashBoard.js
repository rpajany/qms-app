import React, { useEffect, useState } from 'react';
import { Load_PlanData_Service } from '../services/AuditPlanService';
import moment from 'moment';

import { LiaSun } from "react-icons/lia";


export const PlanDashBoard = () => {

    const [planData, setPlanData] = useState([]);

    // const currYear4 = moment().format('YYYY'); // Last two digits of the current year
    // const pastYear4 = moment().subtract(1, 'year').format('YYYY'); // Last two digits of the past year
    const [pastYear4, setPastYear4] = useState("");
    const [currYear4, setCurrYear4] = useState("");


    // const currentYear = moment().format('YY'); // Last two digits of the current year
    // const pastYear = moment().subtract(1, 'year').format('YY'); // Last two digits of the past year
    const [currentYear, setCurrentYear] = useState("");
    const [pastYear, setPastYear] = useState("");


    function getFinancialYear(date = new Date(), startMonth = 4) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1; // Months are 0-indexed

        if (month < startMonth) {
            setPastYear4(year - 1)
            setCurrYear4(year);

            

            // console.log(`1 :- ${year - 1} -${year}`)
            // return `${year - 1}-${year}`;
        } else {

            setPastYear4(year)
            setCurrYear4(year + 1);

           
            // console.log(`2 :- ${year} -${year + 1}`)
            // return `${year}-${year + 1}`;
        }
    }


    console.log('pastYear4 :', pastYear4);
    console.log('currYear4 :', currYear4);

    console.log('pastYear2 :', pastYear);
    console.log('currYear2 :', currentYear);



    const load_PlanData = async () => {
        try {
            const result = await Load_PlanData_Service();
            console.log('result', result)
            if (result.success) {

                setPlanData(result.data);

                // Extract only 'Process' values
                //     const processNames = result.data.map(item => item.Process);
                //     setProcess(processNames);

            }
        } catch (error) {
            console.log('Error in load_Process', error);
        }
    }




    useEffect(() => {
        load_PlanData();
        getFinancialYear();
    }, []);

    return (
        <div>
            <div className='' >
                <div className=' grid grid-cols-1 '>
                    
                    <div className=' text-center mt-2'>
                        <span className='text-md font-bold'>ANNUAL AUDIT PLAN - IATF 16949 : 2016</span><br></br>
                        <span className='text-md font-bold'>Period - {pastYear4} - {currYear4}</span>
                    </div>
                    <div>

                    </div>

                </div>
                <div className='w-full overflow-x-auto  overflow-y-auto mt-1'>

                    <table border="1" style={{ width: '100%', borderCollapse: "collapse", textAlign: "center", font: '', fontSize: '12px' }} >
                        <colgroup>
                            {/* Three new columns */}
                            <col style={{ width: "2%" }} />
                            <col style={{ width: "25%" }} />
                            <col style={{ width: "10%" }} />


                            {/* <col style={{ width: "20%" }} />
                                      <col style={{ width: "17.5%" }} />
                                      <col style={{ width: "17.5%" }} />
          
                                      <col style={{ width: "20%" }} />
                                      <col style={{ width: "17.5%" }} />
                                      <col style={{ width: "17.5%" }} />
          
                                      <col style={{ width: "20%" }} />
                                      <col style={{ width: "17.5%" }} />
                                      <col style={{ width: "17.5%" }} />
          
                                      <col style={{ width: "20%" }} />
                                      <col style={{ width: "17.5%" }} />
                                      <col style={{ width: "17.5%" }} />
          
                                      <col style={{ width: "20%" }} />
                                      <col style={{ width: "17.5%" }} />
                                      <col style={{ width: "17.5%" }} />
          
                                      <col style={{ width: "20%" }} />
                                      <col style={{ width: "17.5%" }} />
                                      <col style={{ width: "17.5%" }} />
          
                                      <col style={{ width: "20%" }} />
                                      <col style={{ width: "17.5%" }} />
                                      <col style={{ width: "17.5%" }} /> */}
                        </colgroup>
                        <thead className=' bg-indigo-400 text-white p-2'>


                            <tr >
                                <th rowSpan={2} className='border border-l p-2'>#</th>
                                <th rowSpan={2} className='border border-l p-2'>Process</th>
                                <th rowSpan={2} className='border border-l p-2'>Frequency</th>

                                <th colSpan={2} className='border-t p-2'>Apr' {pastYear4 % 100}</th>

                                <th colSpan={2} className='border-l border-t p-2'>May' {pastYear4 % 100}</th>

                                <th colSpan={2} className='border-l  border-t p-2'>Jun' {pastYear4 % 100}</th>

                                <th colSpan={2} className='border-l  border-t p-2'>Jul' {pastYear4 % 100}</th>
                                <th colSpan={2} className='border-l  border-t p-2'>Aug' {pastYear4 % 100}</th>
                                <th colSpan={2} className='border-l  border-t p-2'>Sep' {pastYear4 % 100}</th>
                                <th colSpan={2} className='border-l  border-t p-2'>Oct' {pastYear4 % 100}</th>
                                <th colSpan={2} className='border-l  border-t p-2'>Nov' {pastYear4 % 100}</th>
                                <th colSpan={2} className='border-l  border-t p-2'>Dec' {pastYear4 % 100}</th>
                                <th colSpan={2} className='border-l  border-t p-2'>Jan' {currYear4 % 100}</th>
                                <th colSpan={2} className='border-l  border-t p-2'>Feb' {currYear4 % 100}</th>
                                <th colSpan={2} className='border-l  border-t p-2'>Mar' {currYear4 % 100}</th>
                            </tr>




                            <tr>
                                <th className='  border border-r p-2  text-yellow-200'>P</th>
                                <th className='  border border-r p-2 text-green-300'>A</th>

                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='w-96 border border-r p-2 text-green-300'>A</th>

                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='border border-r p-2 text-green-300'>A</th>

                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='border border-r p-2 text-green-300'>A</th>

                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='border border-r p-2 text-green-300'>A</th>
                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='border border-r p-2 text-green-300'>A</th>

                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='border border-r p-2 text-green-300'>A</th>

                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='border border-r p-2 text-green-300'>A</th>

                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='border border-r p-2 text-green-300'>A</th>

                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='border border-r p-2 text-green-300'>A</th>

                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='border border-r p-2 text-green-300'>A</th>

                                <th className='border border-r p-2  text-yellow-200'>P</th>
                                <th className='border border-r p-2 text-green-300'>A</th>

                            </tr>
                        </thead>
                        <tbody>

                            {planData && planData.map((item, index) => (

                                <tr className='border border-gray-300 p-2' key={index}>


                                    <td>{index + 1}</td>
                                    <td className='  text-pretty p-2 text-left'>{item.Process}</td>
                                    <td>{item.Frequency}</td>


                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P1 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''

                                        }
                                    </td>

                                    <td
                                        className={`text-nowrap p-2 text-black ${item.A1?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A1 === "Not Done" ? 'bg-red-400' :
                                                item.A1 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A1 !== '' ? item.A1 : ''}
                                    </td>

                                    {/* P2 A2 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P2 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={` p-2 text-black ${item.A2?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A2 === "Not Done" ? 'bg-red-400' :
                                                item.A2 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A2 !== '' ? item.A2 : ''}
                                    </td>


                                    {/* P3 A3 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P3 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={`text-nowrap p-2 text-black ${item.A3?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A3 === "Not Done" ? 'bg-red-400' :
                                                item.A3 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A3 !== '' ? item.A3 : ''}
                                    </td>

                                    {/* P4 A4 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P4 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={`  p-2 text-black ${item.A4?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A4 === "Not Done" ? 'bg-red-400' :
                                                item.A4 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A4 !== '' ? item.A4 : ''}
                                    </td>

                                    {/* P5 A5 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P5 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={`  p-2 text-black ${item.A5?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A5 === "Not Done" ? 'bg-red-400' :
                                                item.A5 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A5 !== '' ? item.A5 : ''}
                                    </td>

                                    {/* P6 A6 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P6 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={`  p-2 text-black ${item.A6?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A6 === "Not Done" ? 'bg-red-400' :
                                                item.A6 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A6 !== '' ? item.A6 : ''}
                                    </td>

                                    {/* P7 A7 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P7 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={`  p-2 text-black ${item.A7?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A7 === "Not Done" ? 'bg-red-400' :
                                                item.A7 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A7 !== '' ? item.A7 : ''}
                                    </td>

                                    {/* P8 A8 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P8 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={`  p-2 text-black ${item.A8?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A8 === "Not Done" ? 'bg-red-400' :
                                                item.A8 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A8 !== '' ? item.A8 : ''}
                                    </td>


                                    {/* P9 A9 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P9 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={`  p-2 text-black ${item.A9?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A9 === "Not Done" ? 'bg-red-400' :
                                                item.A9 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A9 !== '' ? item.A9 : ''}
                                    </td>

                                    {/* P10 A10 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P10 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={`  p-2 text-black ${item.A10?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A10 === "Not Done" ? 'bg-red-400' :
                                                item.A10 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A10 !== '' ? item.A10 : ''}
                                    </td>

                                    {/* P11 A11 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P11 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={`  p-2 text-black ${item.A11?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A11 === "Not Done" ? 'bg-red-400' :
                                                item.A11 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A11 !== '' ? item.A11 : ''}
                                    </td>

                                    {/* P12 A12 */}
                                    <td className=' bg-blue-500  p-2  ' >
                                        {
                                            item.P12 === 'Schedule' ? <span className='flex flex-col items-center hover:cursor-pointer'><LiaSun className='' /></span> : ''
                                        }
                                    </td>

                                    <td
                                        className={` p-2 text-black ${item.A12?.startsWith("Completed") ? 'bg-green-400' :
                                            item.A12 === "Not Done" ? 'bg-red-400' :
                                                item.A12 === 'Rescheduled' ? 'bg-yellow-400' : ''
                                            }`}

                                    >
                                        {item.A12 !== '' ? item.A12 : ''}
                                    </td>



                                </tr>
                            ))}


                        </tbody>
                    </table>


                    <div className='  text-left items-center mt-4 ml-4'>
                        <span className='flex text-nowrap text-center items-center mb-4 text-md '>{<LiaSun className='mr-2' />}   -  Schedule</span>

                    </div>







                </div>

            </div>

        </div>
    )
}
