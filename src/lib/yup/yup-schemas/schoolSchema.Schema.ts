import * as yup from 'yup';
export const SchoolSchema = yup.object({
    //name must be at least 2 characters, max 20 and either in arabic or hebrew
    name: yup
        .string()
        .required()
        .matches(/^[\u0590-\u05FF\u0600-\u06FF]{2,20}$/, 'errors.nameMustBeHebrewOrArabic||'),

    // 6 digit code
    code: yup
        .string()
        .required()
        .matches(/^[0-9]{6}$/, 'errors.codeMustBeNumber||'),
});
