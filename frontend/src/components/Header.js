import React, { useState } from 'react';
import Logo from '../assets/logo.jpg';
import User_logo from '../assets/default-user.png'

export const Header = () => {
  const [userMenu, setUserMenu] = useState(false);

  // const handle_userDropdown = () => {

  // }

  return (
    <header className='     border-2 bg-slate-200 h-12'>
      <div className='clearfix   mt-1 '>


        <div className='float-left flex  space-x-3 items-center mx-8 '>
          <img src={Logo} alt="brand-logo" className="h-8 object-cover rounded-full" />
          <h6 >India</h6>
        </div>

        <div className='float-right   flex flex-row items-center  mx-8'>
          <nav>
            <ul className='flex gap-4'>
              <li>Home</li>
              <li>About</li>
            </ul>
          </nav>

          <div className='ml-4'>
            <button type="button" onClick={() => setUserMenu(!userMenu)}>
              <span className="sr-only">Toggle dashboard menu</span>
              <img src={User_logo} alt="" className="h-8 object-cover rounded-full" />
            </button>

            {/* Dropdown menu   */}

            {userMenu && (
              <div className="absolute  right-5 z-50  my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Profile</a>
                  </li>

                  <li>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                  </li>
                </ul>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </header>
  )
}
