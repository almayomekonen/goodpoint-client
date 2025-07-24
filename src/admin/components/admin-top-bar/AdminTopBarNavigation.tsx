import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useI18n } from '../../../i18n/mainI18n';

import { useAppLogout } from '../../../common/hooks/useAppLogout';
import '../admin-top-bar/adminTopBar.scss';
import clsx from 'clsx';
import { Button } from '@mui/material';
import { usePopup } from '../../../common/contexts/PopUpProvider';
import { popupType } from '../../../common/enums/popUpType.enum';

interface Props {
    isSuperAdmin?: boolean;
}

const AdminTopBarNavigation: React.FC<Props> = ({ isSuperAdmin }) => {
    const logout = useAppLogout();
    const { openPopup } = usePopup();

    const i18n = useI18n((i18n) => {
        return {
            adminTobBar: i18n.adminTopBar,
            general: i18n.general,
            logout: i18n.menuSideBarText.logout,
        };
    });
    const adminKeyWord = isSuperAdmin ? 'super-admin' : 'admin';
    const navigate = useNavigate();
    const isClassesActive = location.pathname.includes('/admin/classes/study-groups');

    function openLogOutPopup() {
        openPopup(popupType.ARE_U_SURE, {
            title: i18n.general.logoutConfirmation,
            cancelText: i18n.general.cancel,
            okayText: i18n.general.accept,
            onConfirm: logout,
        });
    }

    return (
        <div className={clsx('navigation', adminKeyWord)}>
            <button
                className="clean-no-style-button"
                onClick={() => {
                    navigate(isSuperAdmin ? '/super-admin/schools' : '/');
                }}
            >
                <img src="/logo.svg" className="logo-admin" alt="logo" />
            </button>
            <ul className="nav-list">
                {isSuperAdmin ? (
                    <>
                        <li className="nav-item">
                            <NavLink className="" to="schools">
                                {i18n.adminTobBar.schools}
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="nav-item">
                            <NavLink className="" to="/admin/students">
                                {i18n.adminTobBar.students}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="" to="/admin/teachers">
                                {i18n.adminTobBar.teacher}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={isClassesActive ? 'active' : ''} to="/admin/classes/main-classes">
                                {i18n.adminTobBar.classes}
                            </NavLink>
                        </li>
                    </>
                )}
                <li className="nav-item">
                    <NavLink className="" to={`/${adminKeyWord}/preset-messages`}>
                        {i18n.adminTobBar.presetMessages}
                    </NavLink>
                </li>

                {isSuperAdmin && (
                    <>
                        <li className="nav-item">
                            <NavLink className="" to={`/${adminKeyWord}/actions`}>
                                {i18n.adminTobBar.actions}
                            </NavLink>
                        </li>
                        <li style={{ marginRight: 'auto' }} className="nav-item">
                            <Button
                                onClick={openLogOutPopup}
                                className="clean-no-style-button super-admin-log-out-button"
                            >
                                {i18n.logout}
                            </Button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default AdminTopBarNavigation;
