import * as yup from 'yup';
import { Gender } from '../../../common/enums';
export const AdminSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    // valid email with error message
    username: yup.string().email('errors.invalidEmail||').required(),

    //gender one of gender enum
    gender: yup.mixed().oneOf(Object.values(Gender)).required(),
});
