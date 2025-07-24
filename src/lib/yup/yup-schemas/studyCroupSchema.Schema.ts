import * as yup from 'yup';

export const studyGroupSchema = yup.object({
    name: yup.string().required('errors.requiredField||'),
    grades: yup.array().min(1, 'errors.requiredField||').required(),
});
