import * as yup from 'yup';
import { EMAIL_SCHEMA, NAME_SCHEMA } from './common-schemas';

export const userSchema = yup.object({
    firstName: NAME_SCHEMA,
    lastName: NAME_SCHEMA,
    username: yup.string().concat(EMAIL_SCHEMA).required(),
    phoneNumber: yup.string().phone('05########').notRequired(),
});
