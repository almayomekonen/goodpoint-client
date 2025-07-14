import { Gender } from '../enums';

export type Admin = {
    firstName: string;
    lastName: string;
    username: string;
    gender: Gender;
    id: string;
};
