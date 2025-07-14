import { useSetAuthItem } from '@hilma/auth';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_NAME } from '../consts/auth-storage.consts';
import { gpStorage } from '../interfaces/auth-storage.interface';

/**
 * Custom hook for switching schools
 * @returns {Function} switch function
 */
export const useSwitchSchool = () => {
    const queryClient = useQueryClient();
    const setAuthItem = useSetAuthItem();
    async function switchSchool(schoolId: number) {
        await axios.post('/api/staff/login-to-different-school', { schoolId });

        // Reading the auth token again to trigger the auth hook , so that the role is recalculated
        const token = Cookies.get(ACCESS_TOKEN_NAME);
        if (token) setAuthItem<gpStorage>(ACCESS_TOKEN_NAME, token);
        const kloItem = Cookies.get('klo');
        if (kloItem) setAuthItem<gpStorage>('klo', kloItem);
        queryClient.invalidateQueries({ type: 'all' });
    }

    return switchSchool;
};
