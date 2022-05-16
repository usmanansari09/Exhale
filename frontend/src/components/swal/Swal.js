import swal from 'sweetalert';
import { success_message } from '../../utils/constants';

export const succesSwal = (text) =>{
    swal({
        title: success_message,
        text: text,
        icon: "success",
        button: "Ok",
        className:"swal-custom",
        timer: 5000
      });
}

export const errorSwal = (title,text) =>{
    swal({
        title: title,
        text: text,
        icon: "error",
        button: "Ok",
        timer: 5000
      });
}