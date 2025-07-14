import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormProvider, FormSubmitButton, FormTextInput, useForm, useFormConfig } from '@hilma/forms';
import { provide } from '@hilma/tools';
import * as yup from 'yup';
import { usePopup } from '../../common/contexts/PopUpProvider';
import { popupType } from '../../common/enums/popUpType.enum';

import { Button } from '@mui/material';
import { useUser } from '../../common/contexts/UserContext';
import { TeacherDetails } from '../../common/types/TeacherDetails.type';
import ChangePasswordPopup from '../../components/ChangePasswordPopup';
import { HelmetTitlePage } from '../../components/HelmetTitlePage';
import TitledHeader from '../../components/titled-header/TitledHeader';
import { useI18n, useTranslate } from '../../i18n/mainI18n';
import { useChangeUserDetails } from '../../lib/react-query/hooks/usePersonalAreaDetails';
import { AntSwitch } from './components/StyledMuiComponents';

import { DEFAULT_NOTIFICATION } from '../../common/consts/defaultNotifications';
import { DEFAULT_LANG } from '../../i18n/i18n-consts';
import { Language } from '../../i18n/init-i18n';

import { userSchema } from '../../lib/yup/yup-schemas/userSchema.Schema';

import './styles/personalizedArea.scss';
import Cookies from 'js-cookie';

const userSchemaWithAdditionalData = yup
    .object({
        toggleNotificationsSwitch: yup.boolean(),
        languagesToggle: yup.string().oneOf(Object.values(Language)),
    })
    .concat(userSchema);

type FormValues = yup.InferType<typeof userSchemaWithAdditionalData>;

const PersonalizedArea: React.FC = () => {
    // user context and form data:
    const { user } = useUser();
    const { setValues, values } = useForm<TeacherDetails>();

    //translations
    const translate = useTranslate();
    const i18n = useI18n((i18n) => ({
        personalizedAreaText: i18n.personalizedAreaText,
        pagesTitles: i18n.pagesTitles,
    }));

    //react-query
    const { mutate: changeUserDetails } = useChangeUserDetails();
    // navigation
    const navigate = useNavigate();
    // ui
    const { openPopup } = usePopup();

    useFormConfig<FormValues>(
        (form) => {
            form.translateFn = translate;
            form.onSubmit = submit;
            values.languagesToggle && Cookies.set('lang', values.languagesToggle);
        },
        [translate],
    );

    useEffect(() => {
        if (user) {
            setValues((prev) => {
                return {
                    ...prev,
                    languagesToggle: user.preferredLanguage || DEFAULT_LANG,
                    toggleNotificationsSwitch: Boolean(user.systemNotifications),
                    firstName: user.firstName ?? '',
                    lastName: user.lastName ?? '',
                    phoneNumber: user.phoneNumber ?? '',
                    username: user.idmUser ? '' : user.username,
                };
            });
        }
    }, [user]);
    // functions:
    async function submit(values: FormValues) {
        changeUserDetails({
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber ?? undefined,
            username: values.username,
            systemNotifications: values.toggleNotificationsSwitch ?? true,
            languagesToggle: values.languagesToggle ?? DEFAULT_LANG,
        });
    }

    function changePassword() {
        openPopup(popupType.REGULAR, {
            content: <ChangePasswordPopup />,
        });
    }

    return (
        <>
            <HelmetTitlePage title={i18n.pagesTitles.personalizedArea} />
            <div className="personalized-area-wrapper titled-page">
                <TitledHeader
                    title={i18n.personalizedAreaText.personalizedArea}
                    icon="clear"
                    onNavigate={() => navigate('/', { replace: true })}
                />

                <div className="details-inputs">
                    <FormTextInput
                        label={i18n.personalizedAreaText.firstName}
                        name="firstName"
                        containerClassName="input"
                        maxLength={50}
                    />
                    <FormTextInput
                        label={i18n.personalizedAreaText.lastName}
                        name="lastName"
                        containerClassName="input"
                        maxLength={50}
                    />
                    <FormTextInput
                        label={i18n.personalizedAreaText.phone}
                        name="phoneNumber"
                        containerClassName="input"
                        maxLength={10}
                    />
                    <FormTextInput label={i18n.personalizedAreaText.email} name="username" containerClassName="input" />
                    <Button className="change-password" onClick={changePassword}>
                        {i18n.personalizedAreaText.changePassword}
                    </Button>
                </div>

                <div className="settings-container">
                    {/* <div className="setting"> */}
                    {/*     <span className="setting-span">{i18n.personalizedAreaText.langSettings}</span> */}
                    {/*     <LanguagesToggle /> */}
                    {/* </div> */}
                    <div className="setting">
                        <span className="setting-span">{i18n.personalizedAreaText.notificationsSettings}</span>
                        <AntSwitch name="toggleNotificationsSwitch" />
                    </div>
                </div>
                <footer className="footer-personal">
                    <FormSubmitButton className="save-button">{i18n.personalizedAreaText.save}</FormSubmitButton>
                </footer>
            </div>
        </>
    );
};

export default provide([
    FormProvider,
    {
        initialValues: {
            languagesToggle: DEFAULT_LANG,
            toggleNotificationsSwitch: DEFAULT_NOTIFICATION,
            selectLanguages: DEFAULT_LANG,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            username: '',
        },
        onSubmit: () => {},
        validationSchema: userSchemaWithAdditionalData,
    },
])(PersonalizedArea);
