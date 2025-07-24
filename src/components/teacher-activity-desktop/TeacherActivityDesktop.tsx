import { Box } from '@mui/material';
import { TeacherActivity, TeacherActivityProps } from '../../pages/teacher-activity/TeacherActivity';
import { EmojisDropDown } from '../emojis-dropdown/EmojisDropDown';

import '../dated-good-points-desktop.scss';
import { FC } from 'react';

/**
 * This component displays the dated good points page in desktop view
 * @param listType - the type of the list to display
 *
 */
export const TeacherActivityDesktop: FC<{ listType: TeacherActivityProps['listType'] }> = ({ listType }) => {
    return (
        <div className="dated-gps-desktop-container">
            <div className="dated-gps-desktop">
                <TeacherActivity listType={listType}>
                    <EmojisDropDown />
                </TeacherActivity>
            </div>
            <div className="flex-center dated-gps-desktop-image-container">
                <Box
                    component={'img'}
                    src="/images/pages-images/teacher-activity-background.svg"
                    className="dated-gps-desktop-image"
                />
            </div>
        </div>
    );
};
