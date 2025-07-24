import React, { useEffect } from 'react';

import { FormCheckbox, FormProvider, FormSubmitButton, useAlert, useForm, useFormConfig } from '@hilma/forms';
import { provide } from '@hilma/tools';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import * as yup from 'yup';

import { usePopup } from '../../../common/contexts/PopUpProvider';
import { useI18n, useTranslate } from '../../../i18n/mainI18n';

import AlertWithUndo from '../../common/components/AlertWithUndo';
import './deletePopUp.scss';

interface DeletePopUpProps {
    allChecked: boolean;
    selected: string[];
    count: number;
    categoryTitle: string;
    onDelete: () => Promise<void>;
    specificDelete?: string;
}

/**

DeletePopUp component displays a popup that allows users to delete selected students.
@param {boolean} allChecked - Indicates whether all students are selected.
@param {string[]} selected - An array of student IDs that are selected for deletion.
@param {number} count - The total number of students.
@param {any} studentsTableData - Data for the students table.
@param {Function} onDelete - A callback function that deletes the selected students.
@returns {JSX.Element} - Returns a React functional component that displays the delete student popup.
*/

const DeletePopUp: React.FC<DeletePopUpProps> = ({
    allChecked,
    selected,
    count,
    categoryTitle,
    onDelete,
    specificDelete,
}) => {
    const alert = useAlert();

    const { closePopup } = usePopup();

    const translate = useTranslate();

    const { setErrors } = useForm();

    const displayWarning = selected.length >= 20 || (allChecked && count >= 20);

    useEffect(() => {
        if (displayWarning) setErrors({ checked: 'יש בעיה' });
    }, [selected, allChecked, count]);

    useFormConfig((form) => {
        form.translateFn = translate;
    }, []);

    // translated strings
    const { deletePopUp, general } = useI18n((i18n) => {
        return {
            deletePopUp: i18n.studentsTable.deletePopUp,
            general: i18n.general,
        };
    });

    function handleDeleteDelay(): void {
        alert(
            <AlertWithUndo
                message={general.deletedInProgress}
                onAction={() => {
                    onDelete();
                }}
                buttonMessage={deletePopUp.undo}
            />,
            'warning',
        );

        closePopup();
    }

    return (
        <>
            <div className="admin-table-delete-popup-container">
                <div className="inner-delete-popup">
                    {specificDelete ? (
                        `${deletePopUp.specificDelete} ${specificDelete}?`
                    ) : (
                        <p>{`${deletePopUp.deleteAmount} ${allChecked ? count : selected.length} ${categoryTitle}`} </p>
                    )}
                    {displayWarning && <FormCheckbox name="checked" label={deletePopUp.deleteWarning} />}
                </div>
                <div className="buttons">
                    <Button
                        className={clsx('tab', 'cancel')}
                        onClick={() => closePopup()}
                        variant="outlined"
                        color="primary"
                    >
                        {general.cancel}
                    </Button>

                    <FormSubmitButton className={clsx('tab', 'accept')} onClick={handleDeleteDelay} disabledOnError>
                        {general.areYouSure}
                    </FormSubmitButton>
                </div>
            </div>
        </>
    );
};

export default provide([
    FormProvider,
    {
        initialValues: {
            checked: false,
        },
        validationSchema: yup.object({
            checked: yup.boolean().required().isTrue(),
        }),
        onSubmit: () => {},
    },
])(DeletePopUp);
