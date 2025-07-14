import axios from 'axios';
import { MyClassesData } from '../../../common/types/MyClasses.types';

export const getGradeFilter = async () => {
    const { data: schoolClasses } = await axios.get<MyClassesData>('/api/classes/get-all-school-classes');
    return schoolClasses;
};
