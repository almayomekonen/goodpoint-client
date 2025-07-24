import * as yup from 'yup';
import { EMAIL_SCHEMA, NAME_SCHEMA } from './common-schemas';

export const teacherSchema = yup.object({
    firstName: NAME_SCHEMA,
    lastName: NAME_SCHEMA,
    username: EMAIL_SCHEMA,
    gender: yup.string().required(),
    phoneNumber: yup.string().phone('05########').max(10),
    classes: yup.array().of(
        yup.object({
            content: yup.string(),
            value: yup.string(),
        }),
    ),
});
