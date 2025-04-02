import React from 'react'

export const custom = () => {
  return (
   null
  )
}


export function date_strToObject(strDate) {
    const dateStr = strDate;
    const [day, month, year] = dateStr.split("-").map(Number); // Split the string and convert to numbers
    const dateObj = new Date(year, month - 1, day); // Month is zero-indexed in JS Date
    return dateObj;
}