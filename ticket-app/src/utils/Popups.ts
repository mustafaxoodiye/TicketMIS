import Swal from 'sweetalert2';

export abstract class Popups {

    public static resultConfirmationPopup(res: boolean) {
        if (res) {
            Swal.fire({ icon: 'success', text: 'Your operation has been processed successfully.', showConfirmButton: false });
        } else {
            Swal.fire({ icon: 'error', text: 'Oops, an error ocurred, please try again.', showConfirmButton: false });
        }
    }
}

