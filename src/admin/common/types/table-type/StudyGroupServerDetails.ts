import { SchoolGrades } from '../../../../common/enums';

export type StudyGroupServerDetails = {
    id?: number;
    name: string;
    teacherId?: string;
    studyGroupGrades: { grade: SchoolGrades }[];
};
