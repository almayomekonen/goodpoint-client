import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
//external library
import { FormProvider, FormSubmitButton, FormTextInput, useAlert, useForm, useFormConfig } from '@hilma/forms';
import * as yup from 'yup';

import { provide } from '@hilma/tools';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
//inner library interface
import MultipleSelectAutoComplete from '../../../../lib/hilma-forms/MultipleSelectAutoComplete';
import { StudentForm, studentSchema } from '../../../../lib/yup/yup-schemas/studentSchema.Schema';
//functions
import { formatPhoneNumber } from '../../../common/functions/formatPhoneNumbers';
import { syncAdminStudentsTables } from '../../../common/functions/syncAdminStudentsTables';
//types
import { StudentRow } from '../../../common/types/table-type/row-interfaces';
//hooks
import { usePopup } from '../../../../common/contexts/PopUpProvider';
import { useI18n, useTranslate } from '../../../../i18n/mainI18n';
import { useClassesDropDownFilters } from '../../../../lib/react-query/hooks/useGradeDropdownFilters';
//components
import AdminPopupFormButtons from '../../admin-popup-buttons/AdminPopupFormButtons';
import GenderRadio from '../../gender-radio/GenderRadio';
import ExtraPhoneNumbers from '../extra-phone-numbers/ExtraPhoneNumbers';
//consts
import { adminQueryKeysWithPrefix } from '../../../common/consts/adminTableQueryKeys';
//styles
import './addOrEditFormStyle.scss';

interface EditStudentsDetailsProps {
    isEditMode?: boolean;
    editContent?: StudentRow;
    classId?: number | undefined;
}
type FormValues = yup.InferType<typeof studentSchema>;

/**
 * AddOrEditStudentPopUpContent is a component that renders the content for adding or editing a student.
 * the adding is in a popup. the editing is in the students page
 *
 * @component
 * @param {boolean} [isEditMode=false] - Optional. Specifies whether the component is in edit mode.
 * @param {StudentRow} editContent - The data for editing a student.
 * @param {number | undefined} classId - The ID of the class associated with the student.
 * @returns {JSX.Element} A React element representing the AddOrEditStudentPopUpContent component.
 */

const AddOrEditStudentPopUpContent: React.FC<EditStudentsDetailsProps> = ({ isEditMode = false, editContent }) => {
    const { id } = useParams();
    // array of dropdown options for the grade dropdown selector.
    const memorizedClassesArr = useClassesDropDownFilters();

    const { closePopup } = usePopup();
    const alert = useAlert();

    const queryClient = useQueryClient();

    //form translation
    const { setValues } = useForm<FormValues>();

    const translate = useTranslate();

    useFormConfig<StudentForm>((form) => {
        form.translateFn = translate;
        form.onSubmit = (values: StudentForm) => mutate(values as StudentForm & { classId: number });
    }, []);

    // Use useI18n hook to retrieve translated strings and store them in variables
    const { studentsTable, general, gradesList } = useI18n((i18n) => {
        return {
            studentsTable: i18n.studentsTable,
            general: i18n.general,
            gradesList: i18n.schoolGrades.gradesList,
        };
    });

    useEffect(() => {
        if (isEditMode && editContent) {
            let relativesTemp = editContent.relativesPhoneNumbers.map((relative) => ({
                phone: formatPhoneNumber(String(relative.phone)) || '',
            }));

            // always needs to be two
            if (relativesTemp.length < 2) {
                relativesTemp = [...relativesTemp, { phone: '' }];
            }

            setValues({
                ...editContent,
                classObj: {
                    content: `${gradesList[editContent.class?.grade] ?? ''}${editContent.class?.classIndex ?? ''}`,
                    value: editContent.class
                        ? JSON.stringify({ grade: editContent.class?.grade, classIndex: editContent.class?.classIndex })
                        : '',
                },
                phoneNumber: formatPhoneNumber(
                    String(editContent?.phoneNumber !== null ? editContent?.phoneNumber : ''),
                ),
                relativesPhoneNumbers: relativesTemp,
            });
        }
    }, [editContent, isEditMode]);

    async function submit({ classObj, ...values }: StudentForm & { classId: number }) {
        try {
            delete values.class;

            let savedStudentRes;
            values.relativesPhoneNumbers = values.relativesPhoneNumbers?.filter((item) => !!item.phone);
            const { grade, classIndex } = JSON.parse(classObj?.value ?? '');
            const newValues = {
                ...values,
                grade,
                classIndex,
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
            };
            if (!isEditMode)
                savedStudentRes = await axios.post<{ classId: number }>('/api/student/add-student', newValues);
            else savedStudentRes = await axios.post<{ classId: number }>('/api/student/edit-student', newValues);

            syncAdminStudentsTables(
                { movedTarget: savedStudentRes.data.classId, srcClasses: [values.classId] },
                queryClient,
            );
        } catch (error) {
            return error;
        }
    }

    const { mutate } = useMutation({
        mutationFn: submit,
        onSuccess: () => {
            queryClient.invalidateQueries([`${adminQueryKeysWithPrefix.goodPoint}-${id}`]);
            closePopup();
            alert(isEditMode ? studentsTable.successEditing : studentsTable.successAdding, 'success');
        },
        onError: () => alert(general.errorMessage, 'error'),
    });

    const containerClassNames = clsx({
        'pop-add-container': !isEditMode,
        'edit-container': isEditMode,
    });

    const rowClassNames = clsx({
        'add-row': !isEditMode,
        'edit-row': isEditMode,
    });

    return (
        <>
            <div className="add-or-edit-container">
                <div className={containerClassNames}>
                    <div className={rowClassNames}>
                        <FormTextInput
                            name="firstName"
                            containerClassName="flex-box-elem"
                            label={studentsTable.addPopUp.privateName}
                            data-isrequired={true}
                            key="firstName"
                        />
                        <FormTextInput
                            containerClassName="flex-box-elem"
                            name="lastName"
                            label={studentsTable.addPopUp.lastName}
                            data-isrequired={true}
                            key="lastName"
                        />
                        <span className={clsx('flex-box-elem', !isEditMode && 'flex-center')}>
                            <MultipleSelectAutoComplete
                                name="classObj"
                                label={studentsTable.addPopUp.class}
                                options={memorizedClassesArr ?? []}
                                isRequired
                                data-isrequired={true}
                                data-cy="classAutocomplete"
                            />
                        </span>

                        <span className={clsx('flex-box-elem', !isEditMode && 'flex-center')}>
                            <GenderRadio />
                        </span>

                        <FormTextInput
                            containerClassName="flex-box-elem"
                            name="phoneNumber"
                            label={studentsTable.phoneNumbers.StudentPhoneNumber}
                            key="phoneNumber"
                            maxLength={10}
                        />

                        <FormTextInput
                            containerClassName="flex-box-elem"
                            name="relativesPhoneNumbers[0].phone"
                            label={studentsTable.phoneNumbers.parentPhone + ' 1'}
                            data-isrequired={true}
                            key="relativesPhoneNumbers1"
                            maxLength={10}
                        />
                        <FormTextInput
                            containerClassName="flex-box-elem"
                            name="relativesPhoneNumbers[1].phone"
                            label={studentsTable.phoneNumbers.parentPhone + ' 2'}
                            key="relativesPhoneNumbers2"
                            maxLength={10}
                        />
                        <ExtraPhoneNumbers countMax={4} className="flex-box-elem" />
                    </div>
                    <div className="submit-btn">
                        {isEditMode ? (
                            <div>
                                <FormSubmitButton type="submit" disabledOnError>
                                    {general.saveChanges}
                                </FormSubmitButton>
                            </div>
                        ) : (
                            <>
                                <AdminPopupFormButtons handleClose={closePopup} addOrUpdate={'add'} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default provide([
    FormProvider<StudentForm>,
    {
        initialValues: {
            id: null,
            firstName: '',
            lastName: '',
            gender: '',
            phoneNumber: '',
            relativesPhoneNumbers: [{ phone: '' }, { phone: '' }],
            classObj: {
                content: '',
                value: '',
            },
        },
        onSubmit: () => {},
        validationSchema: studentSchema,
    },
])(AddOrEditStudentPopUpContent);
