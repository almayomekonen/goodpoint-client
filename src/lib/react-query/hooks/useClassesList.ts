import { useQuery } from '@tanstack/react-query';
import { MyClassesData } from '../../../common/types/MyClasses.types';
import { getGradeFilter } from '../api/gradeFilter.api';

export const useClassesList = () => useQuery<MyClassesData>(['schoolClassesList'], getGradeFilter);
