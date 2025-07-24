import React, { useEffect } from 'react';
//external library
import { FormProvider, FormSubmitButton, FormTextInput, useAlert, useForm, useFormConfig } from '@hilma/forms';
import { provide } from '@hilma/tools';
import axios, { AxiosError } from 'axios';
import clsx from 'clsx';

//assets
//types
import { FormikValues } from 'formik';
import { TeacherRow } from '../../../common/types/table-type/row-interfaces/teacherRow.interface';
//hooks
import { usePopup } from '../../../../common/contexts/PopUpProvider';
import { popupType } from '../../../../common/enums/popUpType.enum';
import { useI18n, useTranslate } from '../../../../i18n/mainI18n';
import GenderRadio from '../../gender-radio/GenderRadio';
//components
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { SelectOptionAC, useClassesDropDownFilters } from '../../../../lib/react-query/hooks/useGradeDropdownFilters';
import { adminQueryKeysWithPrefix } from '../../../common/consts/adminTableQueryKeys';
import { teacherSchema } from '../../../../lib/yup/yup-schemas/teacherSchema.Schema';
import { SuccessAddingTeacherPopup } from './SuccessAddingTeacherPopup';

import Button from '@mui/material/Button';
import * as yup from 'yup';
import { formatPhoneNumber } from '../../../common/functions/formatPhoneNumbers';
import MultipleSelectAutoComplete from '../../../../lib/hilma-forms/MultipleSelectAutoComplete';

interface EditTeachersDetailsProps {
    editMode?: boolean;
    editContent?: TeacherRow;
}
type FormsValues = yup.InferType<typeof teacherSchema>;

/**
 * AddTeacherPopUp is a component that renders the content for adding or editing a teacher.
 * the adding is in a popup. the editing is in the teachers page
 * @component
 * @param {boolean} editMode - Specifies whether the popup is in edit mode or not. default to false
 * @param {TeacherRow} editContent - The content to be edited if in edit mode.
 * @returns {JSX.Element} A React element representing the AddTeacherPopUp component.
 */

const AddTeacherPopUp: React.FC<EditTeachersDetailsProps> = ({ editMode = false, editContent }) => {
    const { id } = useParams<{ id: string }>();

    //ui
    const { closePopup, openPopup } = usePopup();
    const alert = useAlert();

    const memorizedClassesArr = useClassesDropDownFilters();

    const queryClient = useQueryClient();

    //form translation
    const translate = useTranslate();
    const { setValues, setErrors } = useForm<FormsValues>();

    useFormConfig((form) => {
        form.translateFn = translate;
        form.onSubmit = submit;
    }, []);

    useEffect(() => {
        if (editMode && editContent) {
            const newClasses: SelectOptionAC[] = [];
            editContent?.classes?.forEach((value) => {
                newClasses.push({
                    content: `${gradesList[value.grade] ?? ''}${value.classIndex ?? ''}`,
                    value: JSON.stringify({ grade: value.grade, classIndex: value.classIndex }),
                });
            });

            const formattedData = {
                firstName: editContent.firstName,
                lastName: editContent.lastName,
                username: editContent.username,
                classes: newClasses,
                gender: editContent.gender,
                phoneNumber:
                    editContent.phoneNumber !== null ? formatPhoneNumber(editContent?.phoneNumber || '') : undefined,
            };
            setValues(formattedData);
        }
    }, [editContent, editMode]);

    // Use useI18n hook to retrieve translated strings and store them in variables
    const { teachersTable, general, gradesList } = useI18n((i18n) => {
        return {
            teachersTable: i18n.teachersTable,
            general: i18n.general,
            gradesList: i18n.schoolGrades.gradesList,
        };
    });

    async function submit(values: FormikValues) {
        const classes: { grade: string; classIndex: number }[] = [];
        values?.classes?.forEach((teacherClass: { value: string }) => {
            classes.push(JSON.parse(teacherClass.value));
        });

        const newValues = { ...values, classes, firstName: values.firstName.trim(), lastName: values.lastName.trim() };

        if (!editMode) {
            try {
                const res = await axios.post('/api/staff/add-teacher', newValues);
                await queryClient.invalidateQueries({ queryKey: [adminQueryKeysWithPrefix.teacher] });
                queryClient.invalidateQueries({ queryKey: ['teachers'], type: 'all' });

                closePopup();

                openPopup(popupType.REGULAR, {
                    title: teachersTable.teacherSuccessfullyAdded,
                    content: <SuccessAddingTeacherPopup newPassword={res.data.password} />,
                });
            } catch (error: any) {
                if ((error as AxiosError) && error.status == 409) {
                    setErrors({ username: teachersTable.teacherExistsInCurrentSchool });
                } else {
                    alert(general.errorMessage, 'error');
                }
            }
        } else {
            try {
                await axios.post(`/api/staff/edit-teacher-by-admin/${id}`, newValues);
                alert(teachersTable.successEditing ?? '', 'success');
                queryClient.invalidateQueries({ queryKey: ['teachers'], type: 'all' });
                await queryClient.invalidateQueries({ queryKey: [adminQueryKeysWithPrefix.teacher] });
                await queryClient.invalidateQueries({ queryKey: ['admin-get-teacher', id] });
            } catch (error: any) {
                if ((error as AxiosError) && error.status == 409) {
                    setErrors({ username: teachersTable.teacherExistsInCurrentSchool });
                } else {
                    alert(general.errorMessage, 'error');
                }
            }
        }
    }

    const containerClassNames = clsx({
        'pop-add-container': !editMode,
        'edit-container': editMode,
    });

    const rowClassNames = clsx({
        'add-row': !editMode,
        'edit-row': editMode,
    });

    return (
        <>
            <div className="add-or-edit-container">
                <div className={containerClassNames}>
                    <div className={rowClassNames}>
                        <FormTextInput
                            name="firstName"
                            containerClassName="flex-box-elem"
                            label={teachersTable.firstName}
                            data-isrequired={true}
                            key="firstName"
                        />
                        <FormTextInput
                            containerClassName="flex-box-elem"
                            name="lastName"
                            label={teachersTable.lastName}
                            data-isrequired={true}
                            key="lastName"
                        />
                        <FormTextInput
                            containerClassName="flex-box-elem"
                            name="username"
                            label={teachersTable.email}
                            data-isrequired={true}
                            key="username"
                        />
                        <span className={clsx('flex-box-elem', !editMode && 'flex-center')}>
                            <GenderRadio />
                        </span>

                        <span className={clsx('flex-box-elem', !editMode && 'flex-center')}>
                            <MultipleSelectAutoComplete
                                name="classes"
                                label={teachersTable.numOfClass}
                                options={memorizedClassesArr ?? []}
                                data-isrequired={true}
                                multiple
                            />
                        </span>

                        <FormTextInput
                            containerClassName="flex-box-elem"
                            name="phoneNumber"
                            label={teachersTable.phoneNumber}
                            key="phoneNumber"
                            maxLength={10}
                        />
                    </div>
                    <div className="submit-btn">
                        {editMode ? (
                            <div className="edit-row submit-btn">
                                <FormSubmitButton>{general.saveChanges}</FormSubmitButton>
                            </div>
                        ) : (
                            <>
                                <Button
                                    className={clsx('tab', 'cancel')}
                                    onClick={() => closePopup()}
                                    variant="outlined"
                                >
                                    {general.cancel}
                                </Button>

                                <FormSubmitButton className={clsx('tab', 'accept')}>{general.add}</FormSubmitButton>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default provide([
    FormProvider,
    {
        initialValues: {
            id: undefined,
            firstName: '',
            lastName: '',
            gender: '',
            username: '',
            phoneNumber: '',
            classes: [],
        },
        onSubmit: () => {},
        validationSchema: teacherSchema,
    },
])(AddTeacherPopUp);
