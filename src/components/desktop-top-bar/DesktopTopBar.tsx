import React, { useState } from 'react';
import { useIsAuthenticated } from '@hilma/auth-core';
import { Button, MenuItem } from '@mui/material';
import clsx from 'clsx';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../common/contexts/UserContext';
import { useMenu } from '../../common/hooks/UseMenu';
import { useSwitchSchool } from '../../common/hooks/useSwitchSchool';
import { useI18n } from '../../i18n/mainI18n';

import './desktop-top-bar.scss';

const DesktopTopBar = () => {
    const { user } = useUser();
    const { Menu, open, openMenu, closeMenu } = useMenu();
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const switchSchool = useSwitchSchool();

    const error = useI18n((i18n) => i18n.errors);

    const currSchoolName = user.schools.find((school) => school.schoolId === user.currSchoolId)?.schoolName;

    const handleSchoolClick = async (schoolId: number, event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        try {
            if (schoolId !== user.currSchoolId) {
                setIsFetching(true);
                await switchSchool(schoolId);
                setIsFetching(false);
                if (pathname !== '/') navigate('/', { replace: true });
            }
        } catch (err) {
            alert(error.somethingWentWrong);
            setIsFetching(false);
        } finally {
            closeMenu(event);
        }
    };

    return (
        <div className="desktop-top-bar-container">
            <img src="/logo.svg" className="icon top-bar-heart-icon" alt="top bar icon" />
            <div className="side-bottuns">
                {isAuthenticated && (
                    <>
                        {user.schools.length > 1 ? (
                            <>
                                <Button
                                    onClick={openMenu}
                                    className="drop-down"
                                    aria-controls={open ? 'top-bar-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <span className="school-name">{currSchoolName}</span>
                                    <KeyboardArrowDownIcon
                                        className={clsx('animationArrow', open && 'animationArrowClose')}
                                        sx={{ stroke: '#ffffff', strokeWidth: 1 }}
                                        fontSize="large"
                                    />
                                </Button>
                                <Menu id="top-bar-menu">
                                    {user.schools.map((school) => (
                                        <MenuItem
                                            disabled={isFetching}
                                            onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) =>
                                                handleSchoolClick(school.schoolId, event)
                                            }
                                            key={school.schoolId}
                                        >
                                            {school.schoolName}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <span className="school-name">{currSchoolName}</span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DesktopTopBar;
