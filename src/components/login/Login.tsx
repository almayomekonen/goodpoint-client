import { useLogin } from '@hilma/auth';
import { FormPassword, FormProvider, FormSubmitButton, FormTextInput } from '@hilma/forms';
import axios, { AxiosError } from 'axios';
import clsx from 'clsx';
import { useState } from 'react';
import * as yup from 'yup';
import { useAlert } from '../../common/contexts/AlertContext';
import { useLanguageToggle } from '../../common/contexts/LanguageToggleLoginContext';
import { isDesktop } from '../../common/functions/isDesktop';
import { useI18n, useTranslate } from '../../i18n/mainI18n';

import EastRoundedIcon from '@mui/icons-material/EastRounded';
import { Button } from '@mui/material';

import { LoginStatusCode } from '../../common/consts/loginStatusCodes.consts';
import { useUpdateLanguage } from '../../common/hooks/useUpdateLanguage.hook';
import { Language } from '../../i18n/init-i18n';
import { EMAIL_SCHEMA } from '../../lib/yup/yup-schemas/common-schemas';
import './Login.scss';

const login_schema = yup.object({
    username: yup.string().concat(EMAIL_SCHEMA).required(),
    password: yup.string().required(),
});

const email_schema = yup.object({
    email: yup.string().concat(EMAIL_SCHEMA).required(),
});

type EmailFormValues = yup.InferType<typeof email_schema>;
type LoginFormValues = yup.InferType<typeof login_schema>;

export const Login = () => {
    const alert = useAlert();
    const i18n = useI18n((i18n) => ({
        loginText: i18n.loginText,
        pagesTitles: i18n.pagesTitles,
        general: i18n.general,
    }));
    const login = useLogin();
    const translate = useTranslate();
    const updateLang = useUpdateLanguage();
    const [forgetPassword, setForgetPassword] = useState<boolean>(false);

    const { language } = useLanguageToggle();

    const desktop = isDesktop();
    const [email, setEmail] = useState<string>('');

    async function loginFunc(values: LoginFormValues) {
        if (!values.password || !values.username) return;
        const { msg } = await login('/api/staff/login', {
            username: values.username.trim(),
            password: values.password,
        });
        if (msg) {
            switch (msg.data.key) {
                case LoginStatusCode.USER_BLOCKED:
                    alert(i18n.loginText.blockedUser, 'error');
                    break;
                case LoginStatusCode.NO_SCHOOLS:
                    alert(i18n.loginText.noUserSchools, 'error');
                    break;
                default:
                    alert(i18n.loginText.loginFailed, 'error');
                    break;
            }
        }

        if (language) updateLang(language as Language);
    }

    async function sendResetPassEmail(values: EmailFormValues) {
        if (email != values.email) {
            try {
                await axios.get(`api/staff/password-reset/${values.email.trim()}`);
                setEmail(values.email);
                alert(i18n.loginText.messageSent, 'success');
            } catch (error: any) {
                if (error as AxiosError) {
                    i18n.general.errorMessage;
                }
            }
        }
    }

    return (
        <div className="login">
            <div className="inputs-container">
                {!forgetPassword ? (
                    <>
                        <FormProvider
                            translateFn={translate}
                            initialValues={{
                                username: '',
                                password: '',
                            }}
                            onSubmit={loginFunc}
                            validationSchema={login_schema}
                        >
                            <FormTextInput placeholder={i18n.loginText.mail} name="username" maxLength={40} />
                            <FormPassword placeholder={i18n.loginText.password} name="password" maxLength={20} />
                            <Button className="forgot-password" onClick={() => setForgetPassword(true)}>
                                {i18n.loginText.forgatPassword}
                            </Button>
                            <FormSubmitButton className={clsx(desktop ? 'login-button-desktop' : 'login-button')}>
                                {i18n.loginText.login}
                            </FormSubmitButton>
                        </FormProvider>
                    </>
                ) : (
                    <>
                        <Button className="prev" onClick={() => setForgetPassword(false)}>
                            <EastRoundedIcon />
                            <span className="label">{i18n.loginText.prev}</span>
                        </Button>

                        <FormProvider
                            translateFn={translate}
                            initialValues={{
                                email: '',
                            }}
                            onSubmit={sendResetPassEmail}
                            validationSchema={email_schema}
                        >
                            <FormTextInput placeholder={i18n.loginText.enterEmail} name="email" maxLength={40} />
                            <FormSubmitButton className={clsx(desktop ? 'login-button-desktop' : 'login-button')}>
                                {i18n.loginText.send}
                            </FormSubmitButton>
                        </FormProvider>
                    </>
                )}
            </div>
        </div>
    );
};
