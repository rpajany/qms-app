import React, { useState, useRef, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Get_MsgCount_Service, Load_MsgView_Service, Delete_Msg_Service } from '../services/HeaderService';
import menus from '../routes/menuConfig';
import Logo from '../assets/INEL_logo_1.png';
import User_logo from '../assets/default-user.png'

import { MdOutlineMessage } from "react-icons/md";
import { TbMessage2 } from "react-icons/tb";
import { TbMessage } from "react-icons/tb";
import { TbMessage2Bolt } from "react-icons/tb";
import { RiDeleteBin2Line } from "react-icons/ri";

export const Header = () => {
  const [userMenu, setUserMenu] = useState(false);
  const { user } = useAuth();
  const menuRef = useRef(null); // Ref to track the dropdown element


  // Get the menu based on the user's role or show the guest menu
  const userRole = user?.role || 'guest'; // Default to 'guest' if no user is logged in
  const { menuItems } = menus[userRole] || []; // Retrieve the appropriate menu items
  // const handle_userDropdown = () => {

  // }
  // console.log('menus :', menus)

  const [msgCount, setMsgCount] = useState(0);
  const [msgModal, setMsgModal] = useState(false);
  const [msgData, setMsgData] = useState({});


  console.log('msgData :', msgData)

  const Get_MsgCount = async () => {
    // console.log("Fetching data at", new Date().toLocaleTimeString());
    // Your API call or event logic here
    try {
      const count = await Get_MsgCount_Service();
      setMsgCount(count.Total);
    } catch (error) {
      console.log("Error Header Get_MsgCount", error);
    }
  };

  useEffect(() => {
    // Function to run every 10 minutes


    // Run the function immediately and then every 10 minutes
    Get_MsgCount();
    const interval = setInterval(Get_MsgCount, 600000); // 600000

    // Cleanup the interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setUserMenu(false); // Close the menu if clicked outside

    }
  };


  useEffect(() => {
    // Add event listener to detect clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  if (!user) return <Navigate to="/login" />; // Redirect if not logged in


  const Load_Msg = async () => {
    try {
      const result = await Load_MsgView_Service();
      if (result) {
        setMsgData(result);
      }
    } catch (error) {
      console.log('Error handle_MsgView :', error)
    }
  }
  const handle_MsgView = async () => {
    try {
      await Load_Msg();
      setMsgModal(true);

    } catch (error) {
      console.log('Error handle_MsgView :', error)
    }
  }


  const handle_MsgDelete = async (item) => {
    try {
      const { id } = item;
      const result = await Delete_Msg_Service(id);

      await Load_Msg();
      await Get_MsgCount();

    } catch (error) {
      console.log('Error handle_MsgHide :', error)
    }
  }

  return (
    <header className=' header    border-2 bg-slate-200 h-12'>
      <div className='clearfix   mt-1 '>


        <div className='float-left flex  space-x-3 items-center mx-8 '>
          <img src={Logo} alt="brand-logo" className="h-8 object-cover rounded-full" />
          <h6 >India Nippon Electric Ltd</h6>
        </div>



        <div className='float-right   flex flex-row items-center  mx-8'>
          {user.Role !== 'admin' ? (
            <div className='mr-8    ' onClick={handle_MsgView}>

              <div className={`${msgCount === 0 ? 'hidden' : 'absolute'} w-5 h-5 z-50 top-1 right-41 ml-2 bg-red-500 text-white rounded-full flex flex-col   items-center`}>
                <span className='text-white font-thin' style={{ fontSize: '15px' }}>{msgCount}</span>
              </div>


              <span className='     text-blue-600 hover:cursor-pointer'><TbMessage2 size={20} /></span>

            </div>
          ) : ''}


          <nav>


            {user.Role === 'auditor' && (
              <ul className='flex gap-4'>
                <li>
                  <Link to="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/audit">
                    Audit
                  </Link>
                </li>



              </ul>
            )}


            {user.Role === 'admin' && (
              <ul className='flex gap-4'>
                <li>
                  <Link to="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/users">
                    Users
                  </Link>
                </li>
                <li>
                  <Link to="/master">
                    Master
                  </Link>
                </li>
                <li>
                  <Link to="/approval">
                    Approval
                  </Link>
                </li>
              </ul>
            )}


          </nav>

          <div className='ml-4'>
            <button type="button" onClick={() => setUserMenu(!userMenu)}>
              <span className="sr-only">Toggle dashboard menu</span>
              <img src={User_logo} alt="" className="h-8 object-cover rounded-full" />
            </button>

            {/* Dropdown menu   */}

            {userMenu && (
              <div className="w-40 z-50 absolute  right-5   my-1 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown" ref={menuRef}>
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">User : <b>{user.Username}</b></span>
                  {/* <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span> */}
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  {/* <li>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Profile</a>
                  </li> */}

                  <li>
                    <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Signout</a>
                  </li>
                </ul>
              </div>
            )}


            {/* Dropdown Message   */}
            {msgModal && msgData.length > 0 && (

              <div className="w-140 z-50 absolute  right-52   my-1 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
                <div className='bg-gray-500 text-white p-2 flex flex-row items-center'>
                  <TbMessage2Bolt /> <span className='ml-2'>Message</span>
                  <button onClick={() => setMsgModal(!msgModal)} className='ml-auto pr-2    hover:cursor-pointer text-white text-xl text-center'>&times;  </button>
                </div>

                <div className='grid grid-flow-row gap-2 p-2 h-48 overflow-y-auto'>


                  {msgData.map((item, index) => (

                    <div className="max-w-sm h-auto  p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">

                      <div className='bg-blue-400 text-white rounded-md px-2  grid grid-rows-3 gap-1'>
                        <div>Audit_UID : {item.Audit_UID}</div>
                        <div> Audit No. : {item.AuditNo}</div>
                        <div> Audit Date : {item.Audit_Date}</div>
                        <div> Department : {item.Department}</div>
                        <div> Process : {item.Process}</div>
                      </div>

                      <div>
                        <span className='text-orange-500'>Message : </span>{item.Message}

                      </div>
                      {/* float-right */}
                      <div className=' pt-4  '>
                        <button
                          type="button"
                          onClick={() => handle_MsgDelete(item)}
                          className='bg-red-500 text-slate-100 flex items-center px-2 py-1 rounded-lg text-xs'
                        ><RiDeleteBin2Line className='mr-2' />Delete</button>
                      </div>
                    </div>

                  ))}
                </div>


              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
