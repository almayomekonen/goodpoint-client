import { Gender } from '../../../../../common/enums';
import { ClassList } from '../../../../../common/types/UserContext.type';

export interface StudentRow {
    id: number;
    firstName: string;
    lastName: string;
    gender: Gender;
    classId: number;
    phoneNumber: string;
    relativesPhoneNumbers: { phone: string }[];
    schoolId: number;
    class: Omit<ClassList, 'id'>;
}
