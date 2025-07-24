import { SchoolGrades } from '../../../../common/enums';

export type StudyGroupFormKeys = {
    id?: number;
    name: string;
    teacher?: {
        id: string;
        label: string;
    };
    grades: SchoolGrades[];
};
