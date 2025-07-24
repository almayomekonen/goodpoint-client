import { Gender } from '../enums';
import { SchoolGrades } from '../enums/school-grade.enum';

export type UserCardType = {
    firstName: string;
    lastName: string;
    gpCount: number;
    class: {
        classIndex: number;
        grade: SchoolGrades;
    };
    id: string | number;
    gender: Gender;
};
