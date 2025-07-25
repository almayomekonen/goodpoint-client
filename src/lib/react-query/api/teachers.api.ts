import apiClient from '../../../api/config';
import { ClassTeacherDetails } from '../../../common/types/classTeacherDetails';

export const getTeachers = async () => {
    const { data } = await apiClient.get<ClassTeacherDetails[]>(`/api/staff/get-teachers-of-school`);
    return data;
};
