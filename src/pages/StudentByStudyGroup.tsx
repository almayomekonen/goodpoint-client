import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useI18n } from '../i18n/mainI18n';

import { useQueryName } from '../common/contexts/StudentListQueryContext';

import { HelmetTitlePage } from '../components/HelmetTitlePage';
import StudentsList from '../components/students-list/StudentsList';

/**
 * Component for displaying a list of students belonging to a specific study group.
 * Fetches and renders the list of students based on the study group ID.
 */
export const StudentsListByStudyGroup = () => {
    const navigate = useNavigate();
    const { studentsQueryName, setStudentsQueryName } = useQueryName();
    const { id, name } = useParams();
    const i18n = useI18n((i18n) => i18n.pagesTitles);

    if (!id) {
        navigate(-1);
        return null;
    }

    /**
     * In case of refresh, array-query is empty/invalid.
     */
    useEffect(() => {
        const queryName = ['studentsStudyGroupList', id].join('-');
        if (studentsQueryName !== queryName) setStudentsQueryName(queryName);
    }, []);

    const path = `/api/student/get-students-by-study-group/${id}`;
    return (
        <div>
            <HelmetTitlePage title={i18n.studentsListByStudyGroup} />

            <StudentsList path={path} studyGroupName={name} />
        </div>
    );
};
