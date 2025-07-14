import * as yup from 'yup';
import { NAME_SCHEMA } from './common-schemas';
import { StudentRow } from '../../../admin/common/types/table-type/row-interfaces';

interface ValidateOptionsExtended {
    options: {
        index: number;
    };
}

export const studentSchema = yup.object({
    id: yup.number().notRequired(),
    firstName: NAME_SCHEMA,
    lastName: NAME_SCHEMA,
    classObj: yup
        .object({
            content: yup.string(),
            value: yup.string(),
        })
        .required()
        .test('test', 'errors.required||', (test) => {
            return test.value ? true : false;
        }),
    gender: yup.string().required(),
    phoneNumber: yup.string().phone('05########'),
    relativesPhoneNumbers: yup.array().of(
        yup.object({
            phone: yup
                .string()
                .phone('05########')
                .test({
                    //Make sure first element of this array is filled.
                    name: 'first-required',
                    message: 'errors.required||',
                    test: function (val) {
                        const { options } = this as yup.TestContext & ValidateOptionsExtended;

                        //if its phone-number-1 (index 0) then its required.
                        if (!options.index && !val) return false;
                        else return true;
                    },
                })
                .test({
                    name: 'unique-phone',
                    message: 'errors.notUnique||',
                    test: function (val) {
                        const { ...context } = this as yup.TestContext & ValidateOptionsExtended;
                        const contextSchema = context.from?.filter((item) => item.value);
                        const relativesPhoneNumbers =
                            contextSchema?.[contextSchema.length - 1].value.relativesPhoneNumbers;
                        const match = context.path.split('.')[0].match(/\[(\d+)\]$/);
                        const parentIndex = match ? parseInt(match[1]) : -1;

                        // Create a Set of phone numbers and check if the current number already exists and filter out the currant number
                        const unique = new Set(
                            relativesPhoneNumbers
                                .filter((item: any, index: number) => item.phone && index !== parentIndex)
                                .map((item: any) => item.phone),
                        );
                        if (unique.has(val)) {
                            return false;
                        } else return true;
                    },
                }),
        }),
    ),
});

export type StudentForm = yup.InferType<typeof studentSchema> & { class?: StudentRow['class'] }; //class is returned from server, but not in use in schema.
