import React from 'react';
import { Hourglass, ProgressBar, RotatingLines } from 'react-loader-spinner'

export const LoadSpinner = ({ isLoading }) => {
  return (
    isLoading && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50"
      >
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    )
  );
}
