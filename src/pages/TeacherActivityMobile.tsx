import { Box } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmojisModal } from '../components/emojis-modal/EmojisModal';
import TitledHeader from '../components/titled-header/TitledHeader';
import { useI18n } from '../i18n/mainI18n';
import { TeacherActivity, TeacherActivityProps } from './teacher-activity/TeacherActivity';

/**
 * Component for displaying the teacher activity in mobile view.
 * Renders the teacher activity list based on the specified list type.
 */
export const TeacherActivityMobile: FC<{
    listType: TeacherActivityProps['listType'];
}> = ({ listType }) => {
    const navigate = useNavigate();

    const i18n = useI18n((i) => ({
        teacherActivityTexts: i.teacherActivity,
    }));

    return (
        <Box className="titled-page">
            <>
                <TitledHeader
                    size="small"
                    onNavigate={() => navigate('/', { replace: true })}
                    icon={'clear'}
                    title={i18n.teacherActivityTexts.myActivity}
                />
                <Box className="teacher-activity-mobile-container fixed-dated-gps">
                    <TeacherActivity listType={listType}>
                        <EmojisModal />
                    </TeacherActivity>
                </Box>
            </>
        </Box>
    );
};
