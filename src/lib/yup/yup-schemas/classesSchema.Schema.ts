import * as yup from 'yup';

export const classesSchema = yup.object({
    grade: yup.string().required(),
    classIndex: yup
        .number()
        .required()
        .integer()
        .positive()
        .lessThan(16, 'errors.numMustBeBetween||')
        .typeError('errors.classMustBeNumber||'),
});
