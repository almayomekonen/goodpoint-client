import React from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import clsx from 'clsx';

import { useUser } from '../../../common/contexts/UserContext';
import { useI18n } from '../../../i18n/mainI18n';

import { usePopup } from '../../../common/contexts/PopUpProvider';
import { popupType } from '../../../common/enums/popUpType.enum';
import { useAppLogout } from '../../../common/hooks/useAppLogout';
import { useMenu } from '../../../common/hooks/UseMenu';

import ChangePasswordPopup from '../../../components/ChangePasswordPopup';
import AdminTopBarNavigation from './AdminTopBarNavigation';

import './adminTopBar.scss';
import { useNavigate } from 'react-router-dom';

const AdminTopBar: React.FC = () => {
    const {
        user,
        user: { currSchoolId },
    } = useUser();
    const school = user.schools.find((school) => school.schoolId === currSchoolId) || { schoolName: '' };
    const navigate = useNavigate();
    const { openPopup } = usePopup();
    const { Menu, open, openMenu, closeMenu } = useMenu();

    const logout = useAppLogout();

    const { personalizedAreaText, general } = useI18n((i18n) => {
        return {
            personalizedAreaText: i18n.personalizedAreaText,
            general: i18n.general,
        };
    });

    function handleLogOutMenu(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        closeMenu(event);
        toggleLogOutPopup();
    }
    function handleChangePasswordMenu(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        closeMenu(event);
        openPopup(popupType.REGULAR, { content: <ChangePasswordPopup /> });
    }

    function toggleLogOutPopup() {
        openPopup(popupType.ARE_U_SURE, {
            title: general.logoutConfirmation,
            cancelText: general.cancel,
            okayText: general.accept,
            onConfirm: logout,
        });
    }
    function handleBackToSystem(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        closeMenu(event);
        navigate('/');
    }

    return (
        <nav className="top-bar-admin">
            <AdminTopBarNavigation isSuperAdmin={false} />
            <Button
                id="menu-button"
                aria-controls={open ? 'admin-top-bar-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={openMenu}
            >
                <React.Fragment>
                    <span className="currant-school-name">{school?.schoolName}</span>

                    <KeyboardArrowDownIcon
                        sx={{ stroke: '#ffffff', strokeWidth: 1 }}
                        className={clsx('animationArrow', open && 'animationArrowClose')}
                        fontSize="large"
                    />
                </React.Fragment>
            </Button>

            <Menu id="admin-top-bar-menu" disableScrollLock={true}>
                <MenuItem onClick={handleChangePasswordMenu}>{personalizedAreaText.changePassword}</MenuItem>
                <MenuItem onClick={handleLogOutMenu}>{personalizedAreaText.logOut}</MenuItem>
                <MenuItem onClick={handleBackToSystem}>{general.backToSystem}</MenuItem>
            </Menu>
        </nav>
    );
};

export default AdminTopBar;
