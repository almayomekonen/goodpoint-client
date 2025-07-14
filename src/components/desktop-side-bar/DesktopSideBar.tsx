import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import cookies from 'js-cookie';
import { FormProvider, FormSubmitButton, FormTextInput } from '@hilma/forms';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, IconButton } from '@mui/material';
import clsx from 'clsx';
import { FormikValues } from 'formik';
import { userSchema } from '../../lib/yup/yup-schemas/userSchema.Schema';
import { usePopup } from '../../common/contexts/PopUpProvider';
import { useSendGpModal } from '../../common/contexts/SendGpModalContext';
import { useUser } from '../../common/contexts/UserContext';
import { validPaths } from '../../common/consts/sideBarPaths.consts';
import { popupType } from '../../common/enums/popUpType.enum';
import { useSideBarTab } from '../../common/hooks/use-side-bar-tab';
import { useAppLogout } from '../../common/hooks/useAppLogout';
import { useMenuItems } from '../../common/hooks/UseMenuItems';
import { useI18n, useTranslate } from '../../i18n/mainI18n';
import { useChangeUserDetails } from '../../lib/react-query/hooks/usePersonalAreaDetails';
import ChangePasswordPopup from '../ChangePasswordPopup';
import GenericPopup from '../generic-popup/GenericPopup';

import './desktop-side-bar.scss';

const DesktopSideBar = () => {
    // States
    const [animationFinished, setAnimationFinished] = useState<boolean>(true);
    const [openEditPopup, setOpenEditPopup] = useState<boolean>(false);
    const [openLogoutPopup, setOpenLogoutPopup] = useState<boolean>(false);
    const { setIsModalOpen } = useSendGpModal();

    //react-query
    const { mutate: changeUserDetails } = useChangeUserDetails();

    //translations
    const { menuSideBarText, general, sentences, ...i18n } = useI18n((i18n) => ({
        personalizedAreaText: i18n?.personalizedAreaText,
        errors: i18n.errors,
        general: i18n.general,
        menuSideBarText: i18n.menuSideBarText,
        sentences: i18n.pagesTitles,
    }));

    const { user } = useUser();
    const logout = useAppLogout();
    const menuObj = useMenuItems('Desktop');
    const { pathname: currentPath } = useLocation();
    const { openPopup } = usePopup();

    const selectedTabRef = useRef<HTMLButtonElement>(null);
    const translate = useTranslate();
    const [currentTabPos, handleTabAnimation] = useSideBarTab(selectedTabRef, setAnimationFinished);

    // Submit Form
    async function submit(values: FormikValues) {
        changeUserDetails({
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phoneNumber,
            username: values.username,
        });
        setOpenEditPopup(false);
    }

    // Change Password
    function changePassword() {
        if (!cookies.get('changePass')) setOpenEditPopup(false);
        openPopup(popupType.REGULAR, {
            content: <ChangePasswordPopup />,
        });
    }

    function isInCurrentTab(tabPathName: string) {
        if (tabPathName === '/') {
            return currentPath === '/' || currentPath === '/teachers-room';
        } else {
            return currentPath.startsWith(tabPathName);
        }
    }

    return (
        <div className="desktop-side-bar-container custom-scroll-bar">
            <div className="user-info">
                <div className="name-div">
                    <div className="name">{`${user.firstName} ${user.lastName}`}</div>
                    <IconButton onClick={() => setOpenEditPopup(true)}>
                        <EditIcon fontSize="small" className="edit-icon" />
                    </IconButton>
                </div>
                <div className="gp-count">
                    <FavoriteIcon fontSize="small" className="heart-icon" />
                    {user.goodPointsCount
                        ? `${general.youSent} ${user.goodPointsCount} ${general.goodPoints}`
                        : general.didntSendGp}
                </div>
            </div>

            <div className="menu-tabs">
                {menuObj.map((tab, index) => (
                    <button
                        key={index}
                        className={clsx('tab', isInCurrentTab(tab.pathName) && animationFinished && 'selected')}
                        onClick={(e) => {
                            if (tab.text != 'logout') {
                                handleTabAnimation(e, tab.pathName);

                                if (!isInCurrentTab(tab.pathName)) tab.onClick();
                            } else {
                                setOpenLogoutPopup(true);
                            }
                        }}
                        ref={
                            (tab.pathName === '/' ? currentPath === tab.pathName : currentPath.startsWith(tab.pathName))
                                ? selectedTabRef
                                : null
                        }
                    >
                        {tab.icon}
                        <span className="text">{menuSideBarText[tab.text as keyof typeof menuSideBarText]}</span>
                    </button>
                ))}

                {validPaths.some((path) => path == currentPath) && (
                    <div
                        className="background-div"
                        style={{
                            top: currentTabPos,
                        }}
                    />
                )}
            </div>

            <Button className="send-gp-button" onClick={() => setIsModalOpen(true)}>
                <AddIcon className="plus-sign" />
                <div className="send-gp">{sentences.sendGP}</div>
            </Button>

            <GenericPopup
                open={openEditPopup}
                clearIcon
                title={general.editProfile}
                content={general.editsWillBeSaved}
                onCancel={() => setOpenEditPopup(false)}
            >
                <FormProvider
                    translateFn={translate}
                    enableReinitialize
                    initialValues={{
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phoneNumber: user.phoneNumber,
                        username: user.idmUser ? '' : user.username,
                    }}
                    onSubmit={submit}
                    validationSchema={userSchema}
                >
                    <div className="edit-profile-popup">
                        <FormTextInput
                            label={i18n.personalizedAreaText.firstName}
                            name="firstName"
                            containerClassName="input"
                        />
                        <FormTextInput
                            label={i18n.personalizedAreaText.lastName}
                            name="lastName"
                            containerClassName="input"
                        />
                        <FormTextInput
                            label={i18n.personalizedAreaText.phone}
                            name="phoneNumber"
                            containerClassName="input"
                            maxLength={10}
                        />
                        <FormTextInput
                            label={i18n.personalizedAreaText.email}
                            name="username"
                            containerClassName="input"
                        />
                        <Button className="change-password" onClick={changePassword}>
                            {i18n.personalizedAreaText.changePassword}
                        </Button>

                        <FormSubmitButton disabledOnError className={clsx('save-details-btn')}>
                            {general.save}
                        </FormSubmitButton>
                    </div>
                </FormProvider>
            </GenericPopup>
            <GenericPopup
                open={openLogoutPopup}
                clearIcon
                title={general.logoutConfirmation}
                onCancel={() => setOpenLogoutPopup(false)}
                onAccept={logout}
                cancelText={general.cancel}
                acceptText={general.accept}
                containerClassName="logout-popup"
            />
        </div>
    );
};
export default DesktopSideBar;
