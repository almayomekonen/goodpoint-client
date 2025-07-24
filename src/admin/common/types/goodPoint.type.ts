import { ClassList } from '../../../common/types/UserContext.type';

export type GoodPoint = {
    gpText: string;
    created: string;
    teacher: Teacher;
    student: Student;
    id: number;
};

type Teacher = {
    firstName: string;
    lastName: string;
};
type Student = {
    firstName: string;
    lastName: string;
    class: Omit<ClassList, 'id'>;
};
