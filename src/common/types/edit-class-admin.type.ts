import { SchoolGrades } from '../enums';

export type EditClassAdmin = {
    grade: SchoolGrades;
    classIndex: number;
    teacherId: string;
    id: number;
};
