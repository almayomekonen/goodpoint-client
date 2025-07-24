import { SchoolGrades } from '../../../../../common/enums';
import { ClassTeacherDetails } from '../../../../../common/types/classTeacherDetails';

export type ClassesRow = {
    id: number;
    grade: SchoolGrades;
    classIndex: number;
    class: string; // grade + classIndex
    teacher?: ClassTeacherDetails;
};

export type StudyGroupsRow = {
    id: number;
    grades: SchoolGrades[];
    name: string;
    teacher?: ClassTeacherDetails;
};
