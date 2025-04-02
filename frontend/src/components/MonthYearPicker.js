import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// https://reactdatepicker.com/

export const MonthYearPicker = ({ title, date, setDate }) => {
    // const [startDate, setStartDate] = useState(new Date());
    return (
        <div className='flex flex-col '>
            <label htmlFor='Frequency' className="mb-2 text-sm font-medium text-gray-900 dark:text-white px-1">
                {title}
            </label>
            <DatePicker
                // selected={startDate}
                // onChange={(date) => setStartDate(date)}
                selected={date}
                onChange={(date) => setDate(date)}
                dateFormat="MMM/yyyy"
                // includeDates={[
                //     1661990400000, 1664582400000, 1667260800000, 1672531200000,
                // ]}
                showMonthYearPicker

                className="block w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
        </div>
    )
}
