import React from 'react'
import { PuffLoader } from 'react-spinners';

export const LoadSpinner = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <PuffLoader color="#3498db" size={60} />
    </div>
  )
}
