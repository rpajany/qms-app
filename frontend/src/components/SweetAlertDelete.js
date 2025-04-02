import React from 'react';
import Swal from 'sweetalert2';

export const SweetAlert_Delete = async (title = "Delete Data !, Are you sure?", text ="You won't be able to revert this!") => {
    const result = await Swal.fire({
        title: title, //'Delete Data !, Are you sure?',
        text: text, //"You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete !'
    });
    if (result.isConfirmed) {
        // console.log('confirmed', 'ok');
        return true;

    } else if (result.isDismissed) {
        // console.log('dismiss', 'yes');
        return false;
    }

//   return (
//     null
//   )
}


// export function SweetAlert_Delete() {
    
// }