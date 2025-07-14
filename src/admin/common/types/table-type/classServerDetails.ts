import { SchoolGrades } from '../../../../common/enums';

export type ClassServerDetails = {
    id?: number;
    classIndex: number;
    grade: SchoolGrades;
    teacherId?: string;
};
