import { FormProvider, useAlert, useFormConfig } from '@hilma/forms';
import { provide } from '@hilma/tools';
import clsx from 'clsx';
import React from 'react';
import * as yup from 'yup';
import { usePopup } from '../../../../common/contexts/PopUpProvider';
import { useI18n, useTranslate } from '../../../../i18n/mainI18n';
import MultipleSelectAutoComplete from '../../../../lib/hilma-forms/MultipleSelectAutoComplete';
import { useClassesDropDownFilters } from '../../../../lib/react-query/hooks/useGradeDropdownFilters';
import AdminPopupFormButtons from '../../admin-popup-buttons/AdminPopupFormButtons';

import AlertWithUndo from '../../../common/components/AlertWithUndo';
import './moveStudentsPopUp.scss';

export const movePopUpSchema = yup.object({
    classObj: yup
        .object({
            content: yup.string(),
            value: yup.string(),
        })
        .test('test', 'errors.required||', (test) => {
            return !!test.value;
        }),
});

export type MovePopUp = yup.InferType<typeof movePopUpSchema>;

interface MoveStudentsPopUpProps {
    count: number;
    onConfirm: (values: MovePopUp) => void;
}
/**
 * MoveStudentsPopUp is a component that renders a popup for moving students.
 *
 * @component
 * @param {number} count - The number of students to be moved.
 * @param {Function} onConfirm - The function to be called when the move is confirmed.
 * @returns {JSX.Element} A React element representing the MoveStudentsPopUp component.
 */
const MoveStudentsPopUp: React.FC<MoveStudentsPopUpProps> = ({ count, onConfirm }) => {
    const alert = useAlert();
    const translate = useTranslate();
    const { closePopup } = usePopup();
    // array of dropdown options for the grade dropdown selector.
    const memorizedClassesArr = useClassesDropDownFilters();

    // translated strings
    const { studentsTable, general } = useI18n((i18n) => {
        return {
            studentsTable: i18n.studentsTable,
            general: i18n.general,
        };
    });

    useFormConfig<MovePopUp>((form) => {
        form.translateFn = translate;
        form.onSubmit = submit;
    }, []);

    async function submit(classObj: MovePopUp) {
        alert(
            <AlertWithUndo
                message={general.updateInProgress}
                onAction={() => {
                    onConfirm(classObj);
                }}
                buttonMessage={general.cancel}
            />,
            'warning',
        );

        closePopup();
    }

    return (
        <>
            <div className={clsx('move-students-popup-container', 'flex-center')}>
                <p className="warning-text">{`${studentsTable.moveStudentsPopUp.warning} ${count} ${studentsTable.students} `}</p>
                <div className={clsx('move-students-select-container', 'flex-center')}>
                    <span className={clsx('MultipleSelectAutoComplete', 'flex-center')}>
                        <MultipleSelectAutoComplete
                            name="classObj"
                            label={studentsTable.addPopUp.class}
                            options={memorizedClassesArr ?? []}
                            isRequired
                            data-isrequired={true}
                        />
                    </span>
                </div>
                <AdminPopupFormButtons handleClose={closePopup} addOrUpdate={'update'} />
            </div>
        </>
    );
};

export default provide([
    FormProvider,
    {
        initialValues: {
            classObj: {
                content: '',
                value: '',
            },
        },
        onSubmit: () => {},
        validationSchema: movePopUpSchema,
        validateOnBlur: true,
    },
])(MoveStudentsPopUp);
