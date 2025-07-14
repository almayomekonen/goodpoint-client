import { Gender } from '../enums';

export type GroupMessageReceiver = {
    id: number;
    firstName: string;
    lastName: string;
    gpCount: number;
    gender: Gender;
    class?: {
        grade: string;
        classIndex: number;
    };
};
