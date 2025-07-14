import { useQuery } from '@tanstack/react-query';
import { getTeachers } from '../api/teachers.api';

export const useGetTeachersQuery = () => useQuery(['teachers'], getTeachers, { refetchOnMount: false });
