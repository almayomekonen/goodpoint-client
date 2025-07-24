import React, { FC, useEffect, useState } from 'react';
//hooks
import { useAlert } from '../common/contexts/AlertContext';
import { useUser } from '../common/contexts/UserContext';
import { useMenuItems } from '../common/hooks/UseMenuItems';
import { useSwitchSchool } from '../common/hooks/useSwitchSchool';
import { useI18n } from '../i18n/mainI18n';
//components
import MassageIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';
import UnreadMassageIcon from '@mui/icons-material/MarkChatUnread';
import SchoolIcon from '@mui/icons-material/School';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { CgMenuRightAlt as MenuIcon } from 'react-icons/cg';
//scss
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGpsSocket } from '../common/contexts/GpSocketContext';
import { usePopup } from '../common/contexts/PopUpProvider';
import { popupType } from '../common/enums/popUpType.enum';
import { useAppLogout } from '../common/hooks/useAppLogout';
import './TopBar.scss';

// To Do: connection to receive notifications (socket)

export const TopBar: FC = () => {
    const { error, general, i18n } = useI18n((i18n) => {
        return { i18n: i18n.menuSideBarText, error: i18n.errors, general: i18n.general };
    });
    const { user, setUser } = useUser();
    const alert = useAlert();
    const logout = useAppLogout();
    const menuObj = useMenuItems('Mobile');
    const navigate = useNavigate();
    const { didReceiveMessage } = useGpsSocket();

    const { openPopup, closePopup } = usePopup();

    const switchSchool = useSwitchSchool();

    //STATE
    const [open, setOpen] = useState<boolean>(false);

    //FUNCTIONS

    async function replaceSchool(schoolId: number) {
        if (user.currSchoolId === schoolId) return;
        try {
            await switchSchool(schoolId);
        } catch {
            alert(error.somethingWentWrong, 'error');
        }
    }

    useEffect(() => {
        //update the user's unread messages
        if (didReceiveMessage) {
            setUser((prev) => {
                return { ...prev, unreadGps: prev.unreadGps + 1 };
            });
        }
    }, [didReceiveMessage]);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setOpen(open);
    };

    function divider(text: string) {
        return (
            <div className="container">
                <div className="border" />
                <span className="content">{text}</span>
                <div className="border" />
            </div>
        );
    }

    function toggleLogOutPopup() {
        openPopup(popupType.ARE_U_SURE, {
            title: general.logoutConfirmation,
            cancelText: general.cancel,
            okayText: general.accept,
            onConfirm: logout,
            onClickCancel: closePopup,
        });
    }

    return (
        <>
            <header className="top-bar-wrapper">
                <MenuIcon onClick={toggleDrawer(true)} className="MenuIcon icon" />
                <SwipeableDrawer
                    anchor={'right'}
                    open={open}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                    className="side-bar"
                    PaperProps={{ style: { left: 'unset', right: 0 } }}
                    dir="rtl"
                >
                    <Box
                        className="side-bar-menu"
                        role="presentation"
                        onClick={toggleDrawer(false)}
                        onKeyDown={toggleDrawer(false)}
                    >
                        {/* SWIPER CONTENT */}
                        <div className="top-menu">
                            <div className="close-line">
                                <CloseIcon className="close-icon" />
                            </div>
                            <List>
                                {menuObj.map((val, index) => (
                                    <ListItem key={index}>
                                        <ListItemButton>
                                            <Button
                                                className="menu-line"
                                                onClick={
                                                    val.text !== 'logout' ? val.onClick : () => toggleLogOutPopup()
                                                }
                                            >
                                                {val.icon}
                                                <span className="text">{i18n[val.text as keyof typeof i18n]}</span>
                                            </Button>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </div>

                        {/* CHANGE SCHOOL */}
                        <div className="bottom-menu">
                            {divider(i18n.schoolsToPresent)}
                            <List>
                                {user.schools?.map((val: { schoolId: number; schoolName: string }, index) => (
                                    <ListItem key={index}>
                                        <ListItemButton className="ListItemButton">
                                            <Button
                                                className={`menu-line ${user.currSchoolId === val.schoolId ? 'highlight' : ''}`}
                                                onClick={() => replaceSchool(val.schoolId)}
                                            >
                                                <SchoolIcon className="menu-icon" />
                                                <span className="text">{val.schoolName}</span>
                                            </Button>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </Box>
                </SwipeableDrawer>

                {/* CURR SCHOOL (not in drawer) */}
                <span className="name">
                    {user.schools.filter((val) => val.schoolId === user.currSchoolId)[0]?.schoolName || ''}
                </span>

                <button
                    onClick={() => navigate('/received-good-points')}
                    className="clean-no-style-button new-messages-button"
                >
                    {user.unreadGps > 0 ? (
                        <>
                            <Typography className="unread-gps-counter">{user.unreadGps}</Typography>
                            <UnreadMassageIcon className="icon" />
                        </>
                    ) : (
                        <MassageIcon className="icon" />
                    )}
                </button>
            </header>
        </>
    );
};
