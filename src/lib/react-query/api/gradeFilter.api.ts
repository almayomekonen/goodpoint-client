import apiClient from '../../../api/config';
import { MyClassesData } from '../../../common/types/MyClasses.types';

export const getGradeFilter = async () => {
    const { data: schoolClasses } = await apiClient.get<MyClassesData>('/api/classes/get-all-school-classes');
    return schoolClasses;
};
