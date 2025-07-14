import { FormProvider, FormSubmitButton, FormTextInput, useForm, useFormConfig } from '@hilma/forms';
import { provide } from '@hilma/tools';
import { Box, Button } from '@mui/material';
import clsx from 'clsx';
import { FC, useEffect } from 'react';
import { useI18n, useTranslate } from '../../../i18n/mainI18n';
import { SchoolSchema } from '../../../lib/yup/yup-schemas/schoolSchema.Schema';
import { SchoolForm } from './SuperAdminSchools';
import './super-admin-schools.scss';
interface Props {
    isEditing: boolean;
    handleFormSubmit: (data: any) => void;
    initialValues: SchoolForm;
    closePopup: () => void;
}

const SuperAdminAddSchoolForm: FC<Props> = ({ isEditing, handleFormSubmit, initialValues, closePopup }) => {
    const i18n = useI18n((i) => {
        return {
            general: i.general,
            superAdmin: i.superAdmin,
        };
    });

    const { setValues } = useForm();
    const translate = useTranslate();

    //setting the onSubmit function
    useFormConfig(
        (form) => {
            form.translateFn = translate;
            form.onSubmit = handleFormSubmit;
        },
        [isEditing, handleFormSubmit],
    );

    useEffect(() => {
        //in case of editing , set the initial values
        setValues(initialValues);
    }, [isEditing]);

    return (
        <div className="super-admin-school-form add-or-edit-container">
            <h2 className="super-admin-school-form-title">
                {isEditing ? i18n.superAdmin.editSchool : i18n.superAdmin.addSchool}
            </h2>

            {/**inputs from hilma forms */}

            <FormTextInput
                name="name"
                containerClassName="flex-box-elem"
                label={i18n.superAdmin.nameOfSchool}
                placeholder={i18n.superAdmin.nameOfSchool}
                data-isrequired={true}
                key="name"
            />
            <FormTextInput
                name="code"
                containerClassName="flex-box-elem"
                label={i18n.superAdmin.codeOfSchool}
                placeholder={i18n.superAdmin.codeOfSchool}
                data-isrequired={true}
                key="code"
                maxLength={6}
            />
            <Box gap="1rem" className="flex-center">
                <Button onClick={closePopup} className={clsx('super-admin-cancel-button', 'flex-box-elem')}>
                    {i18n.general.cancel}
                </Button>
                <FormSubmitButton className={clsx('super-admin-submit-button', 'flex-box-elem')}>
                    {isEditing ? i18n.general.edit : i18n.general.add}
                </FormSubmitButton>
            </Box>
        </div>
    );
};

export default provide([
    FormProvider,
    {
        initialValues: {
            name: '',
            code: '',
            id: -1,
        },
        onSubmit: () => {},
        validationSchema: SchoolSchema,
    },
])(SuperAdminAddSchoolForm);
