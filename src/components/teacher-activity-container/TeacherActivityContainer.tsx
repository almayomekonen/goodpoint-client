import { Box, Typography, useTheme } from '@mui/material';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { isDesktop } from '../../common/functions/isDesktop';
import { useI18n } from '../../i18n/mainI18n';
import './teacher-activity-container.scss';

/**
 *
 * This component is the container for the teacher activity page, it contains the tabs and the outlet for the students and teachers tabs
 */
export const TeacherActivityContainer = () => {
    //0 represents the students tab, 2 represents the teachers tab
    const [selectedTab, setSelectedTab] = React.useState(0);
    const i18n = useI18n((i) => i.general);
    const navigate = useNavigate();
    const theme = useTheme();
    function handleTabClick(dest: 'teachers' | 'students') {
        navigate(`/teacher-activity/${dest}`);
    }

    useEffect(() => {
        setSelectedTab(window.location.pathname.includes('teachers') ? 1 : 0);
    }, [window.location.pathname]);

    const isInDesktop = isDesktop();
    return (
        <Box
            sx={{
                paddingTop: isInDesktop ? '5.3rem' : '0',
            }}
        >
            <Box
                className={clsx(
                    'teacher-activity-container',
                    isInDesktop ? 'teacher-activity-container-desktop' : 'teacher-activity-container-mobile',
                )}
            >
                {/*the top half bar indicating which tab is pressed*/}
                <Box className="teacher-activity-container-header">
                    <button
                        onClick={() => handleTabClick('students')}
                        className={clsx(
                            'teacher-activity-tab',
                            'clean-no-style-button',
                            selectedTab === 0 && 'active-tab',
                        )}
                    >
                        <Box
                            alt=""
                            className="teacher-activity-tab-icon-students"
                            component={'img'}
                            src={`/images/${selectedTab === 0 ? 'active-students-room' : 'students-room'}.svg`}
                        />
                        <Typography
                            color={selectedTab === 0 ? theme.customColors.dark_blue1 : 'grey'}
                            className="teacher-activity-tab-text"
                        >
                            {i18n.students}
                        </Typography>
                    </button>

                    <button
                        onClick={() => handleTabClick('teachers')}
                        className={clsx(
                            'teacher-activity-tab',
                            'clean-no-style-button',
                            selectedTab === 1 && 'active-tab',
                        )}
                    >
                        <Box
                            alt=""
                            className="teacher-activity-tab-icon"
                            component={'img'}
                            src={`/images/${selectedTab === 1 ? 'active-teachers-room' : 'teachers-room'}.svg`}
                        />
                        <Typography
                            color={selectedTab === 1 ? theme.customColors.dark_blue1 : 'grey'}
                            className="teacher-activity-tab-text"
                        >
                            {i18n.teachersRoom}
                        </Typography>
                    </button>
                </Box>

                {/*the bottom half bar indicating which tab is pressed*/}
                <Box className="teacher-activity-bottom-bar">
                    <Box
                        sx={{
                            right: selectedTab === 0 ? '50%' : '0%',
                        }}
                        className="teacher-activity-bottom-bar-inner-background"
                    />
                </Box>
            </Box>

            {/*the outlet would be a dated gps list - either teacher-to-teacher or teacher-to-student*/}
            <Outlet />
        </Box>
    );
};
