import { SchoolGrades } from '../../../../common/enums';

export type ClassFormKeys = {
    id?: number;
    classIndex: number;
    grade: SchoolGrades;
    teacher?: {
        id: string;
        label: string;
    };
};
