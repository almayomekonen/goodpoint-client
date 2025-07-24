import { useEffect } from 'react';

import { FormPassword, FormProvider, FormSubmitButton } from '@hilma/forms';
import { Button } from '@mui/material';
import axios, { AxiosError } from 'axios';
import clsx from 'clsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';

import { useI18n, useTranslate } from '../../i18n/mainI18n';
import { HelmetTitlePage } from '../HelmetTitlePage';

import { STRONG_PASSWORD } from '../../admin/common/consts/regexes';
import { useAlert } from '../../common/contexts/AlertContext';
import { isDesktop } from '../../common/functions/isDesktop';

import './Login.scss';

const passwordSchema = yup.object({
    password_1: yup
        .string()
        .required()
        .matches(STRONG_PASSWORD, 'errors.strongPassword||')
        .min(8, 'errors.passwordMustBeLeastCharacters||'),
    password_2: yup.string().required().confirm('password_1', 'errors.passwordsNotMatch||'),
});

type PasswordFormValues = yup.InferType<typeof passwordSchema>;

export const ChangePassword = () => {
    const alert = useAlert();
    const i18n = useI18n((i18n) => ({
        loginText: i18n.loginText,
        pagesTitles: i18n.pagesTitles,
        general: i18n.general,
    }));
    const translate = useTranslate();
    const navigate = useNavigate();

    const [queryParameters] = useSearchParams();

    const desktop = isDesktop();

    useEffect(() => {
        if (!queryParameters.get('email') || !queryParameters.get('token')) {
            navigate('/');
        }
    }, [queryParameters]);

    async function passwordReset(values: PasswordFormValues) {
        try {
            await axios.put('/api/staff/new-password', {
                email: queryParameters.get('email'),
                password: values.password_2,
                token: queryParameters.get('token'),
            });
            alert(i18n.loginText.resetPasswordSuccess, 'success');
        } catch (error: any) {
            if (error as AxiosError) {
                alert(i18n.general.errorMessage, 'error');
            }
        }
    }

    return (
        <div className="login">
            <HelmetTitlePage title={i18n.pagesTitles.passwordReset} />

            <div className="inputs-container">
                <FormProvider
                    translateFn={translate}
                    initialValues={{
                        password_1: '',
                        password_2: '',
                    }}
                    onSubmit={passwordReset}
                    validationSchema={passwordSchema}
                >
                    {!desktop && <span className="headline">{i18n.loginText.resetPassword}</span>}
                    <FormPassword label={i18n.loginText.newPassword} name="password_1" maxLength={20} />
                    <FormPassword label={i18n.loginText.confirmNewPassword} name="password_2" maxLength={20} />

                    <FormSubmitButton className={clsx(desktop ? 'login-button-desktop' : 'login-button')}>
                        {i18n.loginText.send}
                    </FormSubmitButton>
                    <Button className="back-to-login" onClick={() => navigate('/')}>
                        {i18n.loginText.toLogin}
                    </Button>
                </FormProvider>
            </div>
        </div>
    );
};
