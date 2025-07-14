import clsx from 'clsx';
import { FormPassword, FormProvider, FormSubmitButton, useForm, useFormConfig } from '@hilma/forms';
import { provide } from '@hilma/tools';
import { useI18n, useTranslate } from '../i18n/mainI18n';
import axios, { AxiosError } from 'axios';
import { FormikValues } from 'formik';
import * as yup from 'yup';

import { usePopup } from '../common/contexts/PopUpProvider';
import { isDesktop } from '../common/functions/isDesktop';
import { useAlert } from '../common/contexts/AlertContext';
import { STRONG_PASSWORD } from '../admin/common/consts/regexes';

import './changePasswordPopup.scss';

const schema = yup.object({
    current_password: yup.string().required(),
    password_1: yup
        .string()
        .required()
        .matches(STRONG_PASSWORD, 'errors.strongPassword||')
        .min(8, 'errors.passwordMustBeLeastCharacters||'),
    password_2: yup.string().required().confirm('password_1', 'errors.passwordsNotMatch||'),
});

/**
 * Component for changing the password.
 * Displays a form for the user to enter their current password, new password, and confirm the new password.
 * Validates the form inputs using Yup schema.
 * Sends a request to the server to change the password.
 * Provides feedback to the user based on the response.
 */
const ChangePasswordPopup = () => {
    const { closePopup } = usePopup();
    const i18n = useI18n((i18n) => ({
        personalizedAreaText: i18n.personalizedAreaText,
        loginText: i18n.loginText,
        general: i18n.general,
    }));
    const translate = useTranslate();
    const desktop = isDesktop();
    const alert = useAlert();

    useFormConfig((form) => {
        form.translateFn = translate;
        form.onSubmit = changePassword;
    }, []);

    const { setFieldError } = useForm<FormikValues>();

    async function changePassword(values: FormikValues) {
        try {
            await axios.put('/api/staff/change-password', {
                currentPassword: values.current_password,
                password: values.password_1,
            });
            closePopup();
            alert(i18n.loginText.resetPasswordSuccess, 'success');
        } catch (error: any) {
            if ((error as AxiosError) && error.status == 409 && error.data.error == 'Passwords do not match') {
                setFieldError('current_password', i18n.personalizedAreaText.passwordNotMatch);
            } else if (
                (error as AxiosError) &&
                error.status == 409 &&
                error.data.error == 'Password has already been used in past three times'
            ) {
                setFieldError('password_1', i18n.personalizedAreaText.passwordAlreadyBeenUsed);
            } else {
                alert(i18n.general.errorMessage, 'error');
            }
        }
    }

    return (
        <div className="popup-change-password">
            <span className="headline">{i18n.personalizedAreaText.changePassword}</span>
            <div className="inputs-container">
                <FormPassword
                    label={i18n.personalizedAreaText.currentPassword}
                    name="current_password"
                    maxLength={20}
                />
                <FormPassword label={i18n.personalizedAreaText.newPassword} name="password_1" maxLength={20} />
                <FormPassword label={i18n.personalizedAreaText.confirmNewPassword} name="password_2" maxLength={20} />

                <FormSubmitButton className={clsx(desktop ? 'login-button-desktop' : 'login-button')}>
                    {i18n.personalizedAreaText.changePassword}
                </FormSubmitButton>
            </div>
        </div>
    );
};
export default provide([
    FormProvider,
    {
        initialValues: {
            current_password: '',
            password_1: '',
            password_2: '',
        },
        onSubmit: () => {},
        validationSchema: schema,
    },
])(ChangePasswordPopup);
