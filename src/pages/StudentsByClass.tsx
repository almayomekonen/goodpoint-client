import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useI18n } from '../i18n/mainI18n';

import { useQueryName } from '../common/contexts/StudentListQueryContext';
import { SchoolGrades } from '../common/enums/school-grade.enum';

import { Box } from '@mui/material';
import { HelmetTitlePage } from '../components/HelmetTitlePage';
import StudentsList from '../components/students-list/StudentsList';

/**
 * Component for displaying a list of students belonging to a specific class.
 * Fetches and renders the list of students based on the grade and class index.
 */
export const StudentsListByClass = () => {
    const navigate = useNavigate();
    const i18n = useI18n((i18n) => ({
        search: i18n.searchTeachersAndStudents,
        alphabet: i18n.schoolGrades,
        message: i18n.general,
        pagesTitles: i18n.pagesTitles,
    }));

    const { grade, classIndex } = useParams<{ grade: SchoolGrades; classIndex: `${number}` }>();
    if (!grade || !classIndex) return null;

    const { setStudentsQueryName, studentsQueryName } = useQueryName();

    useEffect(() => {
        if (!Number(classIndex) || !Number(grade) || Number(grade) > 12 || Number(classIndex) > 100) {
            navigate('/', { replace: true });
            return;
        }

        //In case of refresh, array-query is empty/invalid.
        if (!studentsQueryName.includes(`${grade}-${classIndex}`)) {
            setStudentsQueryName(['students', grade, classIndex].join('-'));
        }
    }, [grade, classIndex]);

    const path = `/api/student/get-students/${grade}/${classIndex}`;

    return (
        <Box height="100%">
            <HelmetTitlePage title={i18n.pagesTitles.studentsListByClass} />
            <StudentsList path={path} grade={grade} classIndex={classIndex} />
        </Box>
    );
};
