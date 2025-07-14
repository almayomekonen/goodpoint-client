import { useQuery } from '@tanstack/react-query';
import { SchoolGrades } from '../../../common/enums';
import { getStudentsByGrades, getStudentsOfStudyGroup } from '../api/student-grade.api';

export const useGetStudentByGrades = (grades: SchoolGrades[]) =>
    useQuery(['studentsByGrades'], () => getStudentsByGrades(grades));

export const useGetStudentsIdsOfStudyGroup = (studyGradeId: number) =>
    useQuery(['studentsOfStudyGroup' + studyGradeId], () => getStudentsOfStudyGroup(studyGradeId));
