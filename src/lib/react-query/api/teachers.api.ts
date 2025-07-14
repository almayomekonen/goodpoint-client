import axios from 'axios';
import { ClassTeacherDetails } from '../../../common/types/classTeacherDetails';

export const getTeachers = async () => {
    const { data } = await axios.get<ClassTeacherDetails[]>(`/api/staff/get-teachers-of-school`);
    return data;
};
