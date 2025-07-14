import { Reaction } from './reaction.type';
export interface TeacherActivityStudentGp {
    teacher: {
        firstName: string;
        lastName: string;
        phoneNumber?: string;
    };
    gpText: string;
    created: string;
    id: number;
    reactions?: Reaction[];
    student: {
        firstName: string;
        lastName: string;
    };
}
