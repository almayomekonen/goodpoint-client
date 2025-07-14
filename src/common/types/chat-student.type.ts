import { Gender } from '../enums';

export type ChatStudent = {
    id: number;
    firstName: string;
    lastName: string;
    gender: Gender;
    gpCount: number;
    class?: {
        grade: string;
        classIndex: number;
    };
};
