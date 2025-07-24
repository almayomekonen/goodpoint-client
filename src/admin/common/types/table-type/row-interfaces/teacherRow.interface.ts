import { Gender } from '../../../../../common/enums';
import { ClassList } from '../../../../../common/types/UserContext.type';

export interface TeacherRow {
    id: number | string;
    firstName: string;
    lastName: string;
    gender: Gender;
    username: string;
    phoneNumber?: string;
    classes?: Omit<ClassList, 'id'>[];
}
