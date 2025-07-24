import * as yup from 'yup';

export const dateRangeInputSchema = yup.object({
    dateRangeInput: yup.array().of(yup.date().required()).length(2),
});
