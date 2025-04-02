import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ReactDateRangePicker, LoadSpinner, PlanDashBoard } from '../components';
import { Load_DashBoard_Service, Load_AuditPlan_Service } from '../services/HomeService';
import moment from 'moment';

import { AiOutlineAudit } from "react-icons/ai";
import { GrSun } from "react-icons/gr";
import { RxSun } from "react-icons/rx";
import { LiaSun } from "react-icons/lia";

export const Home = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRangeNow, setDateRangeNow] = useState({});
  const [dashboardData, setDashboardData] = useState(null); // State to store dashboard data
  const [planData, setPlanData] = useState([]); // State to store dashboard data

  const currentYear = moment().format('YY'); // Last two digits of the current year
  const pastYear = moment().subtract(1, 'year').format('YY'); // Last two digits of the past year

  // console.log('user', user);

  // console.log('dateRangeNow :', dateRangeNow);



  const loadData = async () => {
    if (dateRangeNow?.startDate && dateRangeNow?.endDate) {
      try {
        setIsLoading(true);
        const result = await Load_DashBoard_Service(dateRangeNow);
        // console.log('Dashboard Data:', result?.data);
        setDashboardData(result?.data); // Update the dashboard data


      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }

    } else {
      console.log('dateRangeNow is incomplete or undefined.');
    }
  };
  console.log('planData :', planData)

  useEffect(() => {
    if (dateRangeNow?.startDate && dateRangeNow?.endDate) {
      loadData();
    }


  }, [dateRangeNow]) // Trigger loadData whenever dateRangeNow changes


  useEffect(() => {

    const load_PlanData = async () => {
      try {
        const result = await Load_AuditPlan_Service();
        // console.log('result :', result)
        if (result.success) {
          setPlanData(result.data)
        }
      } catch (error) {
        console.log('Error load_PlanData :', error)
      }
    }

    load_PlanData();
    

  }, [])

  return (
    <>
      {/* Loading Spinner */}
      {isLoading && <LoadSpinner isLoading={isLoading} />}

      {/* Show Main Content After Loading */}
      {/* Main Content */}
      {/* {!isLoading && ( */}
      <div className="bg-green-100 h-full ">
        <div className="border-2">
          {/* Header */}
          <div className="text-center border-b bg-white border-gray-300 p-2 mb-4">
            <span className="text-black font-semibold text-xl">Audit Dashboard</span>
          </div>

          {/* Date Range Picker */}
          <div className="flex p-3">
            <ReactDateRangePicker setDateRangeNow={setDateRangeNow} />
          </div>

          {/* Dashboard Data */}
          <div className="grid grid-cols-4 gap-12 py-8 px-8">
            {/* Card Components */}
            {["Total", "Pending", "Approved", "Rejected"].map((key, index) => {
              const bgColors = ["bg-gray-500", "bg-yellow-400", "bg-green-600", "bg-red-600"];
              return (
                <div key={index} className="w-full border border-gray-400 rounded-lg">
                  <div className={`${bgColors[index]} flex items-center rounded-t-md`}>
                    <AiOutlineAudit className="text-white" size="2em" />
                    <span className="text-white ml-4">{key}</span>
                  </div>
                  <div className="mb-4 mt-2 text-center">
                    <span className="font-bold text-4xl">
                      {dashboardData?.[key] ?? "—"} {/* Show "—" if data is not available */}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* AuditPlan Data */}
            <div className='w-[1100px] border border-gray-400 p-1  rounded-md'>
              <div className='bg-gray-400 text-white rounded-t-md p-2  w-full'>
                <p>Audit Plan</p>
              </div>


              <PlanDashBoard />

            </div>

          </div>



        </div>
      </div>
      {/* )} */}
    </>
  )
}
